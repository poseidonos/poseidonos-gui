package v1

func WBTTest() {
	getReportTest("REPORTTEST")
}

func postWBTTest(command string) {
	iBoFRequest := makeRequest("", command)
	sendIBoF(iBoFRequest)
}
