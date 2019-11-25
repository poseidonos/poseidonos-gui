package util

import (
	"encoding/json"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

func PrettyJson(jsonByte interface{}) []byte {
	prettyJSON, err := json.MarshalIndent(jsonByte, "", "    ")

	if err != nil {
		log.Println(err)
		return nil
	}
	return prettyJSON
}

func IsValidUUID(u string) bool {
	_, err := uuid.Parse(u)
	return err == nil
}
