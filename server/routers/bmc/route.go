package bmc

import (
	"github.com/gin-gonic/gin"
)

func Route(router *gin.Engine) {
	// Redfish
	router.Group("/redfish", Redirect)
}
