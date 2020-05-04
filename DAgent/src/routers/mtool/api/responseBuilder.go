package api

import (
	"A-module/log"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"A-module/setting"
	"github.com/gin-gonic/gin"
	"net/http"
)

func HttpResponse(ctx *gin.Context, res model.Response, err error) {
	switch err {
	case iBoFOSV1.ErrBadReq:
		BadRequest(ctx, res, 12000)
	case iBoFOSV1.ErrSending:
		BadRequest(ctx, res, 19002)
	case iBoFOSV1.ErrJson:
		BadRequest(ctx, res, 12310)
	case iBoFOSV1.ErrConn:
		BadRequest(ctx, res, 88888)
	case iBoFOSV1.ErrRes:
		BadRequest(ctx, res, res.Result.Status.Code)
	default:
		if err != nil {
			BadRequest(ctx, res, res.Result.Status.Code)
		} else {
			Success(ctx, res, res.Result.Status.Code)
		}
	}
}

func Unauthorized(ctx *gin.Context, res model.Response, code int) {
	makeResponse(ctx, http.StatusUnauthorized, res, code)
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
		res.Result.Status.Description = description(code)
	}

	log.Infof("makeResponse : %+v", res)
	ctx.AbortWithStatusJSON(httpStatus, &res)
}

func description(code int) string {
	return setting.StatusMap[code]
}
