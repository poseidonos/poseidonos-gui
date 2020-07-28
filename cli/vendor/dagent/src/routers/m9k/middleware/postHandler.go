package middleware

import (
	"a-module/src/log"
	"a-module/src/routers/m9k/model"
	"a-module/src/util"
	"bytes"
	"dagent/src/routers/m9k/api/dagent"
	"encoding/json"
	"github.com/gin-gonic/gin"
)

type responseBody struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w responseBody) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func PostHandler(ctx *gin.Context) {
	// Gin does not save rb, so we write rb rb manually
	responseBody := &responseBody{body: bytes.NewBufferString(""), ResponseWriter: ctx.Writer}
	ctx.Writer = responseBody

	ctx.Next()
	log.Debugf("Response Status Code : %d", responseBody.Status())
	log.Debugf("Response Header  : %v", responseBody.Header())
	log.Debugf("Response Body  : %v", util.PrettyJson(responseBody.body.String()))

	response := model.Response{}
	_ = json.Unmarshal(responseBody.body.Bytes(), &response)
	updateHeartBeat(response.LastSuccessTime)
}

func updateHeartBeat(successTime int64) {
	if successTime > 0 {
		dagent.LastSuccessTime = successTime
	}
}
