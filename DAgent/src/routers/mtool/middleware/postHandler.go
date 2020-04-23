package middleware

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
)

type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func PostHandler(ctx *gin.Context) {
	//blw := &bodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: ctx.Writer}
	//ctx.Writer = blw

	ctx.Next()

	statusCode := ctx.Writer.Status()
	fmt.Println("Response statusCode : " + string(statusCode))
	//fmt.Println("Response body : " + blw.body.String())
}
