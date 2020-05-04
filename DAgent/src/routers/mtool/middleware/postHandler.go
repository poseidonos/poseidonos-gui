package middleware

import (
	"A-module/log"
	v1 "DAgent/src/routers/mtool/api/dagent/v1"
	"bytes"
	"github.com/gin-gonic/gin"
	"time"
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
	log.Debugf("Response Status Code : %s", string(rb.Status()))
	log.Debugf("Response Header  : %v", rb.Header())
	log.Debugf("Response Body  : %s", rb.body.String())

	updateHeartBeat()
}

func updateHeartBeat() {
	v1.LastAliveTime = time.Now().UTC().Unix()
}

//{
//"rid": "527630b1-31d5-42db-94d7-a057676faffd",
//"result": {
//"status": {
//"code": 0,
//"description": "alive"
//}
//}
//}
