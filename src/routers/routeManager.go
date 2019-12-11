package routers

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/src/routers/bmc"
	"ibofdagent/src/routers/mtool"
	"ibofdagent/src/routers/nbp"
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