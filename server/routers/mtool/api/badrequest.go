package api

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func ReturnFail(ctx *gin.Context, description string, code int) {

	result := Result{}
	result.Status.Code = code
	result.Status.Description = description

	response := Response{
		Result: result,
	}

	log.Printf("ReturnFail : %+v", result)
	ctx.AbortWithStatusJSON(http.StatusBadRequest, &response)
}
