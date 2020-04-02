package handler

import (
	"A-module/log"
	_ "A-module/routers/mtool/model"
	"A-module/setting"
	"A-module/util"
	"bytes"
	_ "encoding/json"
	"errors"
	"io"
	"net"
	_ "time"
)

var conn net.Conn

//var iBoFReceiveChan chan []byte
//var bmcSendChan chan string
//var bmcReceiveChan chan string

func init() {
	//iBoFReceiveChan = make(chan []byte, 1000)
	//go readFromIBoFSocket()
}

func ConnectToIBoFOS() error {
	var err error = nil

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

	return err
}

func DisconnectToIBoFOS() error {
	var err error = nil

	if conn != nil {
		err = conn.Close()
	}

	return err
}

func ReadFromIBoFSocket() ([]byte, error) {

	var err error
	var buf []byte

	log.Println("readFromIBoFSocket Start")

	if conn == nil {
		log.Println("readFromIBoFSocket : Conn is nil")
	} else {
		buf = make([]byte, 4096)
		_, err = conn.Read(buf)
		if err != nil || err == io.EOF {
			log.Println("readFromIBoFSocket : Message Receive Fail :", err)
			conn.Close()
			conn = nil
		} else {
			log.Println("readFromIBoFSocket : Message Receive Success")
			buf = bytes.Trim(buf, "\x00")
		}
	}
	return buf, err
}

/*
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
*/

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
