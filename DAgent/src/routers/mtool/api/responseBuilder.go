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
		BadRequest(c, res, 12000)
	case iBoFOSV1.ErrSending:
		BadRequest(c, res, 19002)
	case iBoFOSV1.ErrJson:
		BadRequest(c, res, 12310)
	case iBoFOSV1.ErrRes:
		BadRequest(c, res, res.Result.Status.Code)
	default:
		if err != nil {
			BadRequest(c, res, 99999)
		} else {
			success(c, res, res.Result.Status.Code)
		}
	}
}

func Unauthorized(c *gin.Context, res model.Response, code int) {
	makeResponse(c, http.StatusUnauthorized, res, code)
}

func BadRequest(c *gin.Context, res model.Response, code int) {
	makeResponse(c, http.StatusBadRequest, res, code)
}

func success(c *gin.Context, res model.Response, code int) {
	makeResponse(c, http.StatusOK, res, code)
}

func makeResponse(c *gin.Context, httpStatus int, res model.Response, code int) {
	res.Result.Status.Code = code

	if res.Result.Status.Description == "" {
		res.Result.Status.Description = description(code)
	}

	log.Printf("makeResponse : %+v", res)
	c.AbortWithStatusJSON(httpStatus, &res)
}

func description(code int) string {
	return setting.StatusMap[code]
}
