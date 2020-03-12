package v1

func ReportTest() {
	getReportTest("REPORTTEST")
}

func getReportTest(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}
