package api

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool/model"
	"ibofdagent/server/setting"
	log "github.com/sirupsen/logrus"
	"net/http"
)

func MakeUnauthorized(ctx *gin.Context, code int) {
	description := Description(code)
	MakeFailResponse(ctx, http.StatusUnauthorized, description, code)
}

func MakeBadRequest(ctx *gin.Context, code int) {
	description := Description(code)
	MakeFailResponse(ctx, http.StatusBadRequest, description, code)
}

func MakeFailResponse(ctx *gin.Context, httpStatus int, description string, code int) {
	result := model.Result{}
	result.Status.Code = code
	result.Status.Description = description

	response := model.Response{
		Result: result,
	}

	log.Printf("MakeFailResponse : %+v", result)
	ctx.AbortWithStatusJSON(httpStatus, &response)
}

// https://golang.org/doc/effective_go.html#Getters
// it's neither idiomatic nor necessary to put Get into the getter's name.
func Description(code int) string {
	return setting.StatusMap[code]
}
