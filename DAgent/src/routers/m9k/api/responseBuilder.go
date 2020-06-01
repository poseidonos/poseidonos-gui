package api

import (
	"A-module/log"
	iBoFOS "A-module/routers/m9k/api/ibofos"
	"A-module/routers/m9k/model"
	"A-module/setting"
	"github.com/gin-gonic/gin"
	"net/http"
)

func HttpResponse(ctx *gin.Context, res model.Response, err error) {
	switch err {
	case iBoFOS.ErrBadReq:
		BadRequest(ctx, res, 12000)
	case iBoFOS.ErrSending:
		BadRequest(ctx, res, 19002)
	case iBoFOS.ErrJson:
		BadRequest(ctx, res, 12310)
	case iBoFOS.ErrConn:
		BadRequest(ctx, res, 88888)
	case iBoFOS.ErrRes:
		BadRequest(ctx, res, res.Result.Status.Code)
	default:
		makeResponseWithErr(ctx, res, res.Result.Status.Code, err)
	}
}

func Unauthorized(ctx *gin.Context, res model.Response, code int) {
	makeResponse(ctx, http.StatusUnauthorized, res, code)
}

func makeResponseWithErr(ctx *gin.Context, res model.Response, code int, err error) {
	if err != nil || res.Result.Status.Code != 0 {
		BadRequest(ctx, res, res.Result.Status.Code)
	} else {
		Success(ctx, res, res.Result.Status.Code)
	}
}

func BadRequest(ctx *gin.Context, res model.Response, code int) {
	makeResponse(ctx, http.StatusBadRequest, res, code)
}

func Success(ctx *gin.Context, res model.Response, code int) {
	makeResponse(ctx, http.StatusOK, res, code)
}

func makeResponse(ctx *gin.Context, httpStatus int, res model.Response, code int) {
	res.Result.Status.Code = code

	if res.Result.Status.Description == "" {
		res.Result.Status.Description = setting.StatusDesc(code)
	}

	log.Infof("makeResponse : %+v", res)
	ctx.AbortWithStatusJSON(httpStatus, &res)
}
