package bmc

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

var redfishHost = "https://10.1.1.28"

func Redirect(ctx *gin.Context) {
	ctx.Redirect(http.StatusTemporaryRedirect, redfishHost+ctx.Request.RequestURI)
	log.Printf("Redirect : %s", redfishHost+ctx.Request.RequestURI)
}
