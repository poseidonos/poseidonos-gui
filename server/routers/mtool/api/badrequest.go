package api

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/setting"
	"log"
	"net/http"
)

func MakeFailResponse(ctx *gin.Context, code int) {
	description := getDescription(code)
	MakeFailResponseWithDescription(ctx, description, code)
}

func MakeFailResponseWithDescription(ctx *gin.Context, description string, code int) {
	result := Result{}
	result.Status.Code = code
	result.Status.Description = description

	response := Response{
		Result: result,
	}

	log.Printf("MakeFailResponse : %+v", result)
	ctx.AbortWithStatusJSON(http.StatusBadRequest, &response)
}

func getDescription(code int) string {
	return setting.StatusCode[code]
}

