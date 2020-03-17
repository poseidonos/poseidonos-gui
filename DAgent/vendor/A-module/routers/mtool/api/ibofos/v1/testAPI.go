package v1

func ReportTest(rid string) {
	getReportTest(rid, "REPORTTEST")
}

func getReportTest(rid string, command string) {
	iBoFRequest := makeRequest(rid, command)
	sendIBoF(iBoFRequest)
}
