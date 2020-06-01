package routers

import (
	"DAgent/src/routers/bmc"
	"DAgent/src/routers/m9k"
	"DAgent/src/routers/nbp"
	"github.com/gin-gonic/gin"
)

// Init Router Info
func InitRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	bmc.Route(router)
	m9k.Route(router)
	nbp.Route(router)

	return router
}
