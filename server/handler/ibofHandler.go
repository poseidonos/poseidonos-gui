package handler

import (
	"bufio"
	"bytes"
	"errors"
	"ibofdagent/server/setting"
	"ibofdagent/server/util"
	"io"
	"log"
	"net"
	"time"
)

var connbuf *bufio.Reader

var conn net.Conn

var iBoFReceiveChan chan []byte
var iBoFSendChan chan []byte
var bmcSendChan chan string
var bmcReceiveChan chan string

func init() {
	iBoFReceiveChan = make(chan []byte, 100)
	iBoFSendChan = make(chan []byte, 100)
	connbuf = bufio.NewReader(conn)

	go handleSend()
}

func ConnectToIBoFOS() error {
	var err error = nil
	for {
		if conn == nil {
			uri := setting.Config.Server.IBoF.IP + ":" + setting.Config.Server.IBoF.Port
			conn, err = net.Dial("tcp", uri)
			if err != nil {
				log.Println("ConnectToIBoFOS : ", err)
				setting.Config.DAgentSocketAddr = "Disconnect"
				setting.Config.IBoFOSSocketAddr = "Disconnect"
			} else {
				setting.Config.DAgentSocketAddr = conn.LocalAddr().String()
				setting.Config.IBoFOSSocketAddr = conn.RemoteAddr().String()
			}
			util.PrintCurrentServerStatus()
		}

		time.Sleep(time.Second)
	}
	return err
}

func receiveFromIBoFSocket() error {
	log.Println("receiveFromIBoFSocket Start")
	var err error

	if conn == nil {
		err = errors.New("receiveFromIBoFSocket : Conn is nil")
		log.Println(err)
	} else {
		buf := make([]byte, 4096)
		_, err := conn.Read(buf)
		if err != nil && err != io.EOF {
			log.Println("receiveFromIBoFSocket : Message Receive Fail :", err)
		} else {
			log.Println("receiveFromIBoFSocket : Message Receive Success")
			buf = bytes.Trim(buf, "\x00")
			iBoFReceiveChan <- buf
			log.Println("receiveFromIBoFSocket : Message -> iBoFReceiveChan")
		}
	}

	return err
}

func GetIBoFResponse() []byte {
	return <-iBoFReceiveChan
}

func SendIBof(marshaled []byte) {
	iBoFSendChan <- marshaled
	log.Printf("SendIBof : Message -> iBoFSendChan\n%s", marshaled)
}

func handleSend() {
	for {
		log.Println("handleSend : Waiting message from send channel")

		select {
		case marshaled := <-iBoFSendChan:
			log.Printf("handleSend : Message <- iBoFSendChan, Left iBoFSendChan Jobs : %d", len(iBoFSendChan))
			writeToIBoFSocket(marshaled)

		case bmcMsg := <-bmcSendChan:
			log.Println("handleSend : Message <- bmcSendChan, Left bmcSendChan Jobs  %d", len(bmcSendChan))
			writeToBMCSomething(bmcMsg)
		}
	}
}

func writeToIBoFSocket(marshaled []byte) error {
	for {
		if conn == nil {
			log.Println("writeToIBoFSocket : Conn is nil")
		} else {
			_, err := conn.Write(marshaled)
			if err != nil {
				log.Println("writeToIBoFSocket : Fail with write message to socket - ", err)
				conn.Close()
				conn = nil
			} else {
				// Must Sync call
				log.Println("writeToIBoFSocket : Success write message to socket")
				err = receiveFromIBoFSocket()
				if err != nil {
					conn.Close()
					conn = nil
				} else {
					log.Printf("writeToIBoFSocket : Write/Receive Success %s\n", marshaled)
					return err
				}
			}
		}
		time.Sleep(time.Second)
	}
}
