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

package api_

import (
	"dagent/src/routers/m9k/api/caller"
	"github.com/gin-gonic/gin"
	"net/http"
	"pnconnector/src/log"
	"pnconnector/src/routers/m9k/model"
)

func HttpResponse(ctx *gin.Context, res model.Response, err error) {
	switch err {
	case caller.ErrSending:
		BadRequest(ctx, res, 11000)
	case caller.ErrJson:
		BadRequest(ctx, res, 11010)
	case caller.ErrConn:
		BadRequest(ctx, res, 11020)
	case caller.ErrReceiving:
		BadRequest(ctx, res, 10050)
	case caller.ErrJsonType:
		BadRequest(ctx, res, 10005)
	case caller.ErrRes:
		BadRequest(ctx, res, res.Result.Status.Code)
	default:
		makeResponseWithErr(ctx, res, res.Result.Status.Code, err)
	}
}

func Unauthorized(ctx *gin.Context, res model.Response, code int) {
	makeResponse(ctx, http.StatusUnauthorized, res, code, false)
}

func makeResponseWithErr(ctx *gin.Context, res model.Response, code int, err error) {
	if res.Result.Status.Code != 0 {
		BadRequest(ctx, res, res.Result.Status.Code)
	} else if err != nil {
		BadRequest(ctx, res, 10004)
	} else {
		Success(ctx, res, res.Result.Status.Code)
	}
}

func BadRequest(ctx *gin.Context, res model.Response, code int) {
	makeResponse(ctx, http.StatusBadRequest, res, code, true)
}

func Success(ctx *gin.Context, res model.Response, code int) {
	makeResponse(ctx, http.StatusOK, res, code, false)
}

func makeResponse(ctx *gin.Context, httpStatus int, res model.Response, code int, isBadRequest bool) {
	posDescription := res.Result.Status.Description
	errorInfo := res.Result.Status.ErrorInfo
	res.Result.Status.PosDescription = posDescription
	if isBadRequest == true {
		log.Errorf("makeResponse : %+v", res)
	} else {
		log.Infof("makeResponse : %+v", res)
	}

	if errorInfo != nil {
		res.Result.Status.ErrorInfo = errorInfo
		if errorInfo.(map[string]interface{})["errorCode"] == 1 {
			ctx.AbortWithStatusJSON(207, &res)
		} else {
			ctx.AbortWithStatusJSON(httpStatus, &res)
		}

	} else {
		ctx.AbortWithStatusJSON(httpStatus, &res)

	}

}
