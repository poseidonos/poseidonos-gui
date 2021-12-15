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
package ibofos

import (
	"pnconnector/src/routers/m9k/model"
)

func ListArray(xrId string, param interface{}) (model.Request, model.Response, error) {
  return arraySender(xrId, param, "LISTARRAY")
}

func ListArrayDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return arraySender(xrId, param, "LISTARRAYDEVICE")
}

func LoadArray(xrId string, param interface{}) (model.Request, model.Response, error) {
	return arraySender(xrId, param, "LOADARRAY")
}

func CreateArray(xrId string, param interface{}) (model.Request, model.Response, error) {
	return arraySender(xrId, param, "CREATEARRAY")
}

func AutoCreateArray(xrId string, param interface{}) (model.Request, model.Response, error) {
        return arraySender(xrId, param, "AUTOCREATEARRAY")
}

func DeleteArray(xrId string, param interface{}) (model.Request, model.Response, error) {
	return arraySender(xrId, param, "DELETEARRAY")
}

func ArrayInfo(xrId string, param interface{}) (model.Request, model.Response, error) {
	return arraySender(xrId, param, "ARRAYINFO")
}

func AddDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return arraySender(xrId, param, "ADDDEVICE")
}

func RemoveDevice(xrId string, param interface{}) (model.Request, model.Response, error) {
	return arraySender(xrId, param, "REMOVEDEVICE")
}

func arraySender(xrId string, param interface{}, command string) (model.Request, model.Response, error) {
	return Requester{xrId, param, model.ArrayParam{}}.Send(command)
}

func MountArray(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "MOUNTARRAY")
}

func UnmountArray(xrId string, param interface{}) (model.Request, model.Response, error) {
	return SystemSender(xrId, param, "UNMOUNTARRAY")
}
func ArrayReset(xrId string, param interface{}) (model.Request, model.Response, error) {
  return SystemSender(xrId, param, "RESETMBR")
}
