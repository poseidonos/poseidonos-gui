package middleware

import (
	"A-module/log"
	"bytes"
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
	// Gin does not save rb rb, so we write rb rb manually
	rb := &responseBody{body: bytes.NewBufferString(""), ResponseWriter: ctx.Writer}
	ctx.Writer = rb

	ctx.Next()
	log.Debugf("Response Status Code : %s", string(rb.Status()))
	log.Debugf("Response Header  : %v", rb.Header())
	log.Debugf("Response Body  : %s", rb.body.String())

	saveHeartBeat(rb.body)
}

func saveHeartBeat(body *bytes.Buffer) {

}
