package bmc

import (
	"crypto/tls"
	"github.com/gin-gonic/gin"
	"ibofdagent/server/setting"
	"net/http"
	"net/http/httputil"
)

func Redirect(ctx *gin.Context) {
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	director := func(req *http.Request) {
		req.URL.Scheme = "https"
		req.URL.Host = setting.Config.Server.BMC.IP
	}

	proxy := &httputil.ReverseProxy{Director: director}
	proxy.ServeHTTP(ctx.Writer, ctx.Request)
}
