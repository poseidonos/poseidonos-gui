package v1

func ReportTest(xrId string) {
	getReportTest(xrId, "REPORTTEST")
}

func getReportTest(xrId string, command string) {
	iBoFRequest := makeRequest(xrId, command)
	sendIBoF(iBoFRequest)
}
