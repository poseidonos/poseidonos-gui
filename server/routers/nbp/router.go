package nbp

import (
	"github.com/gin-gonic/gin"
	"ibofdagent/server/routers/nbp/api/dagent/v1"
)

func Route(router *gin.Engine) {
	apiV1 := router.Group("/nbp/api/v1")
	apiV1.GET("/ping", v1.Ping)
}
