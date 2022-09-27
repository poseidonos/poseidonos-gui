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

package middleware

import (
	"bytes"
	"dagent/src/routers/m9k/api/dagent"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"kouros/log"
	"kouros/model"
)

type responseBody struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w responseBody) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func PostHandler(ctx *gin.Context) {
	// Gin does not save responseBody, so we write responseBody responseBody manually
	responseBody := &responseBody{body: bytes.NewBufferString(""), ResponseWriter: ctx.Writer}
	ctx.Writer = responseBody

	ctx.Next()
	log.Debugf("Response Status Code : %d", responseBody.Status())
	log.Debugf("Response Header  : %v", responseBody.Header())
	log.Debugf("Response Body  : %s", responseBody.body.String())

	response := model.Response{}
	_ = json.Unmarshal(responseBody.body.Bytes(), &response)
	updateHeartBeat(response.LastSuccessTime)
}

func updateHeartBeat(successTime int64) {
	if successTime > 0 {
		dagent.LastSuccessTime = successTime
	}
}
