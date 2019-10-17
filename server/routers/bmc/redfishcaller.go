package bmc

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func Redirect(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, "https://10.1.1.28/")
}
