package bmc

import (
	"crypto/tls"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httputil"
)

func Redirect(ctx *gin.Context) {
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	var id = "root"
	var pass = "0penBmc"
	var target = id + ":" + pass + "@10.1.1.28"

	director := func(req *http.Request) {
		//r := ctx.Request
		req.URL.Scheme = "https"
		req.URL.Host = target
		// ???
		//req.Header["my-header"] = []string{r.Header.Get("my-header")}
		// Golang camelcases headers
		//delete(req.Header, "My-Header")
	}
	proxy := &httputil.ReverseProxy{Director: director}
	proxy.ServeHTTP(ctx.Writer, ctx.Request)
}
