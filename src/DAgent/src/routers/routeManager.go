package routers

import (
	"github.com/gin-gonic/gin"
	"DAgent/src/routers/bmc"
	"DAgent/src/routers/mtool"
	"DAgent/src/routers/nbp"
)

// Init Router Info
func InitRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	bmc.Route(router)
	mtool.Route(router)
	nbp.Route(router)

	return router
}
