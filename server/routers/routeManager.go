package routers

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/mtool"
	"ibofdagent/server/routers/nbp"
)

// Init Router Info
func InitRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	mtool.Route(router)
	nbp.Route(router)
	return router
}
