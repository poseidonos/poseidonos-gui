package bmc

import (
	"github.com/gin-gonic/gin"
)

func Route(router *gin.Engine) {
	uri := router.Group("/bmc")

	// Redfish
	redFish := uri.Group("/redfish")
	{
		redFish.GET("/", Redirect)
	}
}


