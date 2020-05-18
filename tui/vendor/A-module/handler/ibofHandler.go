package handler

import (
	"A-module/log"
	"A-module/setting"
	"A-module/util"
	"bytes"
	"errors"
	"io"
)

func init() {
}

func ConnectToIBoFOS() error {
	var err error = nil
	uri := setting.Config.Server.IBoF.IP + ":" + setting.Config.Server.IBoF.Port

	conn, err = Dial("tcp", uri)

	if err != nil {
		log.Info("ConnectToIBoFOS : ", err)
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

	log.Info("readFromIBoFSocket Start")

	if conn == nil {
		log.Info("readFromIBoFSocket : Conn is nil")
	} else {
		buf = make([]byte, 4096*10)
		_, err = conn.Read(buf)
		if err != nil || err == io.EOF {
			log.Info("readFromIBoFSocket : Message Receive Fail :", err)
			conn.Close()
			conn = nil
		} else {
			log.Info("readFromIBoFSocket : Message Receive Success")
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
		log.Info("GetIBoFResponse : Timeout")
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
		log.Error(err)
	} else {
		_, err = conn.Write(marshaled)
		if err != nil {
			conn.Close()
			conn = nil
			log.Infof("WriteToIBoFSocket : Writre Fail - %s\n", err)
			log.Infof("WriteToIBoFSocket : Conn closed\n")
		} else {
			log.Infof("WriteToIBoFSocket : Write Success\n")
		}
	}
	return err
}
