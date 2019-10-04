package handler

import (
	"log"
)

func init() {
	bmcSendChan = make(chan string, 1)
}

func ConnectToBMC() error {
	return nil
}

func GetBMCResponse() string {
	return <-bmcReceiveChan
}

func SendBMC(bmcMsg string) {
	bmcSendChan <- bmcMsg
	log.Printf("SendBMC : Message -> bmcSendChan\n%s", bmcMsg)
}

func writeToBMCSomething(bmcMsg string) {
}
