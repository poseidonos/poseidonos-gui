package bmc

import (
	"crypto/tls"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httputil"
)

func Redirect(ctx *gin.Context) {
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	var target = "10.1.1.28"

	director := func(req *http.Request) {
		req.URL.Scheme = "https"
		req.URL.Host = target
	}

	proxy := &httputil.ReverseProxy{Director: director}
	proxy.ServeHTTP(ctx.Writer, ctx.Request)
}
