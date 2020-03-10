package v1
/*
import "github.com/gin-gonic/gin"

func ReportTest(ctx *gin.Context) {
	getReportTest(ctx, "REPORTTEST")
}

func getReportTest(ctx *gin.Context, command string) {
	iBoFRequest := makeRequest(ctx, command)
	sendIBoF(ctx, iBoFRequest)
}
*/
func ReportTest() {
	getReportTest("REPORTTEST")
}

func getReportTest(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}
