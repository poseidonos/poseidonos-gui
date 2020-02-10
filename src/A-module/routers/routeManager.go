package routers

import (
	"github.com/gin-gonic/gin"
	"A-module/routers/bmc"
	"A-module/routers/mtool"
	"A-module/routers/nbp"
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
