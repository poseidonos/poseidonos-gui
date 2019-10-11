package handler

import (
	"bufio"
	"bytes"
	"encoding/json"
	"errors"
	"ibofdagent/server/routers/mtool/model"
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
	iBoFSendChan = make(chan []byte, 1)
	connbuf = bufio.NewReader(conn)
	go receiveFromIBoFSocket()
	//go handleSend()
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

		time.Sleep(time.Second * 1)
	}
	return err
}

func receiveFromIBoFSocket() {
	for {
		log.Println("receiveFromIBoFSocket Start")
		if conn == nil {
			log.Println("receiveFromIBoFSocket : Conn is nil")
			time.Sleep(time.Second)
		} else {
			buf := make([]byte, 4096)
			_, err := conn.Read(buf)
			if err != nil || err == io.EOF {
				//if err != nil && err != io.EOF {
				log.Println("receiveFromIBoFSocket : Message Receive Fail :", err)
				conn.Close()
				conn = nil
			} else {
				log.Println("receiveFromIBoFSocket : Message Receive Success")
				buf = bytes.Trim(buf, "\x00")
				iBoFReceiveChan <- buf
				log.Println("receiveFromIBoFSocket : Message -> iBoFReceiveChan")
			}
		}
	}
}

func GetIBoFResponse() []byte {
	select {
	case ret := <-iBoFReceiveChan:
		return ret
	case <-time.After(time.Second * 29):
		log.Println("GetIBoFResponse : Timeout")
		response := model.Response{}
		response.Rid = "timeout"
		response.Result.Status.Code = 19000
		ret, _ := json.Marshal(response)
		return ret
	}
}

//func SendIBof(marshaled []byte) error {
//	//iBoFSendChan <- marshaled
//	log.Printf("SendIBof : Message -> iBoFSendChan\n%s", marshaled)
//	return WriteToIBoFSocket(marshaled)
//}

//func handleSend() {
//for {
//	log.Println("handleSend : Waiting message from send channel")
//
//	select {
//	case marshaled := <-iBoFSendChan:
//		log.Printf("handleSend : Message <- iBoFSendChan, Left iBoFSendChan Jobs : %d", len(iBoFSendChan))
//		WriteToIBoFSocket(marshaled)
//
//	case bmcMsg := <-bmcSendChan:
//		log.Println("handleSend : Message <- bmcSendChan, Left bmcSendChan Jobs  %d", len(bmcSendChan))
//		writeToBMCSomething(bmcMsg)
//	}
//}
//}

func WriteToIBoFSocket(marshaled []byte) error {
	var err error = nil
	//for {
	if conn == nil {
		log.Println("WriteToIBoFSocket : Conn is nil")
		err = errors.New("WriteToIBoFSocket : Conn is nil")
	} else {
		_, err = conn.Write(marshaled)
		if err != nil {
			log.Println("WriteToIBoFSocket : Fail with write message to socket - ", err)
			conn.Close()
			conn = nil
		} else {
			//receiveFromIBoFSocket()
		}
		//else {
		//	// Must Sync call
		//	log.Println("WriteToIBoFSocket : Success write message to socket")
		//	err = receiveFromIBoFSocket()
		//	if err != nil {
		//		log.Printf("WriteToIBoFSocket : receiveFromIBoFSocket Fail %s\n", marshaled)
		//		conn.Close()
		//		conn = nil
		//	} else {
		//		log.Printf("WriteToIBoFSocket : receiveFromIBoFSocket Success %s\n", marshaled)
		//		//return err
		//	}
		//}
	}
	return err
	//time.Sleep(time.Second)
	//}
}
