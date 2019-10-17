package bmc

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

var redfishhost = "https:10.1.1.28"

func Redirect(ctx *gin.Context) {
	ctx.Redirect(http.StatusTemporaryRedirect, redfishhost)
}
