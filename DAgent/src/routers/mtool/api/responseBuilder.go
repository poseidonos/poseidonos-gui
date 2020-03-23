package api

import (
	"A-module/log"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"A-module/setting"
	"github.com/gin-gonic/gin"
	"net/http"
)

func HttpResponse(c *gin.Context, res model.Response, err error) {
	switch err {
	case iBoFOSV1.ErrBadReq:
		BadRequest(c, 12000)
	case iBoFOSV1.ErrSending:
		BadRequest(c, 19002)
	case iBoFOSV1.ErrJson:
		BadRequest(c, 12310)
	case iBoFOSV1.ErrRes:
		BadRequest(c, res.Result.Status.Code)
	default:
		Success(c)
	}
}

func Unauthorized(ctx *gin.Context, code int) {
	makeResponse(ctx, http.StatusUnauthorized, "", code)
}

func BadRequest(ctx *gin.Context, code int) {
	makeResponse(ctx, http.StatusBadRequest, "", code)
}

func Success(ctx *gin.Context) {
	makeResponse(ctx, http.StatusOK, "", 0)
}

func makeResponse(ctx *gin.Context, httpStatus int, description string, code int) {
	res := model.Response{}
	res.Result.Status.Code = code

	if description == "" {
		res.Result.Status.Description = StatusDescription(code)
	}

	log.Printf("makeResponse : %+v", res)
	ctx.AbortWithStatusJSON(httpStatus, &res)
}

func StatusDescription(code int) string {
	return setting.StatusMap[code]
}
