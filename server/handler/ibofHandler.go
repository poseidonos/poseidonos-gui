package handler

import (
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

var conn net.Conn
var iBoFReceiveChan chan []byte
var bmcSendChan chan string
var bmcReceiveChan chan string

func init() {
	iBoFReceiveChan = make(chan []byte, 1000)
	go readFromIBoFSocket()
}

func ConnectToIBoFOS() {
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
}

func readFromIBoFSocket() {
	for {
		log.Println("readFromIBoFSocket Start")
		if conn == nil {
			log.Println("readFromIBoFSocket : Conn is nil")
			time.Sleep(time.Second)
		} else {
			buf := make([]byte, 4096)
			_, err := conn.Read(buf)
			if err != nil || err == io.EOF {
				log.Println("readFromIBoFSocket : Message Receive Fail :", err)
				conn.Close()
				conn = nil
			} else {
				log.Println("readFromIBoFSocket : Message Receive Success")
				buf = bytes.Trim(buf, "\x00")
				iBoFReceiveChan <- buf
				log.Println("readFromIBoFSocket : Message -> iBoFReceiveChan")
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

func WriteToIBoFSocket(marshaled []byte) error {
	var err error = nil
	if conn == nil {
		err = errors.New("WriteToIBoFSocket : Conn is nil")
		log.Println(err)
	} else {
		_, err = conn.Write(marshaled)
		if err != nil {
			conn.Close()
			conn = nil
			log.Printf("WriteToIBoFSocket : Writre Fail - %s\n", err)
			log.Printf("WriteToIBoFSocket : Conn closed\n")
		} else {
			log.Printf("WriteToIBoFSocket : Write Success\n")
		}
	}
	return err
}
