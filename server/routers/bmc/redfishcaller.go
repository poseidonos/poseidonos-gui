package bmc

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httputil"
)

var target = "10.1.1.28"

func Redirect(ctx *gin.Context) {
	//ctx.Redirect(http.StatusTemporaryRedirect, target+ctx.Request.RequestURI)
	//log.Printf("Redirect : %s", target+ctx.Request.RequestURI)

	director := func(req *http.Request) {
		r := ctx.Request
		//req = r
		req.URL.Scheme = "https"
		req.URL.Host = target
		req.Header["my-header"] = []string{r.Header.Get("my-header")}
		// Golang camelcases headers
		delete(req.Header, "My-Header")
	}
	proxy := &httputil.ReverseProxy{Director: director}
	proxy.ServeHTTP(c.Writer, c.Request)
}
