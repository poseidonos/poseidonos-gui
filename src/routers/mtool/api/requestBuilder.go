package api

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/src/routers/mtool/model"
	"ibofdagent/src/setting"
	log "github.com/sirupsen/logrus"
	"net/http"
)

func MakeUnauthorized(ctx *gin.Context, code int) {
	description := description(code)
	MakeResponse(ctx, http.StatusUnauthorized, description, code)
}

func MakeBadRequest(ctx *gin.Context, code int) {
	description := description(code)
	MakeResponse(ctx, http.StatusBadRequest, description, code)
}

func MakeResponse(ctx *gin.Context, httpStatus int, description string, code int) {
	result := model.Result{}
	result.Status.Code = code
	result.Status.Description = description

	response := model.Response{
		Result: result,
	}

	log.Printf("MakeResponse : %+v", result)
	ctx.AbortWithStatusJSON(httpStatus, &response)
}

func MakeSuccess(ctx *gin.Context) {
	description := description(0)
	MakeResponse(ctx, http.StatusOK, description, 0)
}

// https://golang.org/doc/effective_go.html#Getters
// it's neither idiomatic nor necessary to put Get into the getter's name.
func description(code int) string {
	return setting.StatusMap[code]
}
