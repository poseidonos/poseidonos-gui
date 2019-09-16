package v1

import "github.com/gin-gonic/gin"

func ReportTest(ctx *gin.Context) {
	getReportTest(ctx, "REPORTTEST")
}

func getReportTest(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendWithSync(ctx, iBoFRequest)
}
