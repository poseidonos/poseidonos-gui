package utils

import (
	"log"
	"github.com/google/uuid"
)

func GenerateUUID() string {
	reqID, err := uuid.NewUUID()
	if err != nil {
		log.Print("Error in Generating UUID ", err.Error())
	}
	return reqID.String()
}
