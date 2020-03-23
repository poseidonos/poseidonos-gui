package api

import (
	"A-module/log"
	"A-module/routers/mtool/model"
	"A-module/setting"
	"github.com/gin-gonic/gin"
	"net/http"
)

func MakeUnauthorized(ctx *gin.Context, code int) {
	MakeResponse(ctx, http.StatusUnauthorized, "", code)
}

func MakeBadRequest(ctx *gin.Context, code int) {
	MakeResponse(ctx, http.StatusBadRequest, "", code)
}

func MakeResponse(ctx *gin.Context, httpStatus int, description string, code int) {
	response := model.Response{}
	MakeResponseWithRes(ctx, httpStatus, description, code, response)
}

func MakeResponseWithRes(ctx *gin.Context, httpStatus int, description string, code int, response model.Response) {
	response.Result.Status.Code = code
	if description == "" {
		response.Result.Status.Description = StatusDescription(code)
	}
	log.Printf("MakeResponse : %+v", response)
	ctx.AbortWithStatusJSON(httpStatus, &response)
}

func MakeSuccess(ctx *gin.Context) {
	response := model.Response{}
	MakeSuccessWithRes(ctx, response)
}

func MakeSuccessWithRes(ctx *gin.Context, response model.Response) {
	MakeResponseWithRes(ctx, http.StatusOK, "", 0, response)
}

// https://golang.org/doc/effective_go.html#Getters
// it's neither idiomatic nor necessary to put Get into the getter's name.
func StatusDescription(code int) string {
	return setting.StatusMap[code]
}
