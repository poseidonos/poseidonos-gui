package api

import (
	"a-module/log"
	iBoFOS "a-module/routers/m9k/api/ibofos"
	"a-module/routers/m9k/model"
	//"a-module/setting"
	"a-module/util"
	"github.com/gin-gonic/gin"
	"net/http"
)

func HttpResponse(ctx *gin.Context, res model.Response, err error) {
	switch err {
	case iBoFOS.ErrSending:
		BadRequest(ctx, res, 11000)
	case iBoFOS.ErrJson:
		BadRequest(ctx, res, 11010)
	case iBoFOS.ErrConn:
		BadRequest(ctx, res, 11020)
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
	res.Result.Status, _ = util.GetStatusInfo(code)
	log.Infof("makeResponse : %+v", res)
	ctx.AbortWithStatusJSON(httpStatus, &res)
}
