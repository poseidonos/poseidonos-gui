package api

import (
	"github.com/gin-gonic/gin"
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
	result.Status.Description = getDescription(code)

	response := Response{
		Result: result,
	}

	log.Printf("MakeFailResponse : %+v", result)
	ctx.AbortWithStatusJSON(http.StatusBadRequest, &response)
}

func getDescription(code int) string {
	return "I will implement ASAP. d.moon"
}

//RESTFul Error
//[Header 10200]
//- 10240 X-request-Id is invalid in header
//- 10250 ts is missing in header
//
//[Body 10300]
//- 10310 Json Body Error
//
//[D-Agent 11000]
//- 11000 exec command error
//
//[iBoF 12000]
//- 12000 iBoF is busy, Try later
//- 12310  iBoF Unmarshal Error
//- 12030 iBoF does not run, Please run iBoFOS first
