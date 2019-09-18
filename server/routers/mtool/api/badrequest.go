package api

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/setting"
	"log"
	"net/http"
)

func MakeUnauthorized(ctx *gin.Context, code int) {
	description := getDescription(code)
	MakeFailResponse(ctx, http.StatusUnauthorized, description, code)
}

func MakeBadRequest(ctx *gin.Context, code int) {
	description := getDescription(code)
	MakeFailResponse(ctx, http.StatusBadRequest, description, code)
}

func MakeFailResponse(ctx *gin.Context, httpStatus int, description string, code int) {
	result := Result{}
	result.Status.Code = code
	result.Status.Description = description

	response := Response{
		Result: result,
	}

	log.Printf("MakeFailResponse : %+v", result)
	ctx.AbortWithStatusJSON(httpStatus, &response)
}

func getDescription(code int) string {
	return setting.StatusCode[code]
}
