/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package handler

import (
	"bufio"
	"errors"
	"io"
	"net"
	"pnconnector/src/log"
	"pnconnector/src/setting"
	"pnconnector/src/util"
)

func ConnectToIBoFOS() (net.Conn, error) {
	var err error = nil
	uri := setting.Config.Server.IBoF.IP + ":" + setting.Config.Server.IBoF.Port

	conn, err := Dial("tcp", uri)

	if err != nil {
		log.Info("ConnectToIBoFOS : ", err)
		setting.Config.DAgentSocketAddr = "Disconnect"
		setting.Config.IBoFOSSocketAddr = "Disconnect"
	} else {
		setting.Config.DAgentSocketAddr = conn.LocalAddr().String()
		setting.Config.IBoFOSSocketAddr = conn.RemoteAddr().String()
	}
	util.PrintCurrentServerStatus()

	return conn, err
}

func DisconnectToIBoFOS(conn net.Conn) error {
	var err error = nil

	if conn != nil {
		log.Info("Connection Cloase : ", conn.LocalAddr().String())
		err = conn.Close()
	}

	return err
}

func ReadFromIBoFSocket(conn net.Conn) (string, error) {
	var err error
	//var buf []byte
	var res string
	log.Info("readFromIBoFSocket Start")

	if conn == nil {
		log.Info("readFromIBoFSocket : Conn is nil")
	} else {
		//buf = make([]byte, 1024*1024)
		//_, err = conn.Read(buf)
		res, err = bufio.NewReader(conn).ReadString('\n')
		if err != nil && err != io.EOF {
			log.Info("readFromIBoFSocket : Message Receive Fail :", err)
			//conn.Close()
			//conn = nil
		} /*else {
			log.Info("readFromIBoFSocket : Message Receive Success")
			buf = bytes.Trim(buf, "\x00")
		}*/
	}
	return res, err
}

func WriteToIBoFSocket(conn net.Conn, marshaled []byte) error {
	var err error = nil
	if conn == nil {
		err = errors.New("WriteToIBoFSocket : Conn is nil")
		log.Error(err)
	} else {
		_, err = conn.Write(marshaled)
		if err != nil {
			//conn.Close()
			//conn = nil
			log.Infof("WriteToIBoFSocket : Writre Fail - %s\n", err)
			log.Infof("WriteToIBoFSocket : Conn closed\n")
		} else {
			log.Infof("WriteToIBoFSocket : Write Success\n")
		}
	}
	return err
}
