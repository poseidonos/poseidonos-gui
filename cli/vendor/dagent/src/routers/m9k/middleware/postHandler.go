package middleware

import (
	"a-module/log"
	"a-module/routers/m9k/model"
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
	rb := &responseBody{body: bytes.NewBufferString(""), ResponseWriter: ctx.Writer}
	ctx.Writer = rb

	ctx.Next()
	log.Debugf("Response Status Code : %d", rb.Status())
	log.Debugf("Response Header  : %v", rb.Header())
	log.Debugf("Response Body  : %s", rb.body.String())

	response := model.Response{}
	_ = json.Unmarshal(rb.body.Bytes(), &response)
	updateHeartBeat(response.LastSuccessTime)
}

func updateHeartBeat(successTime int64) {
	if successTime > 0 {
		dagent.LastSuccessTime = successTime
	}
}
