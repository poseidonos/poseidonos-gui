package util

import (
	"encoding/json"
	"github.com/google/uuid"
	"pnconnector/src/log"
)

func PrettyJson(jsonByte interface{}) []byte {
	prettyJSON, err := json.MarshalIndent(jsonByte, "", "    ")

	if err != nil {
		log.Error(err)
		return nil
	}
	return prettyJSON
}

func IsValidUUID(u string) bool {
	_, err := uuid.Parse(u)
	return err == nil
}
