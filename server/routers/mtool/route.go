package mtool

import (
	"github.com/gin-gonic/gin"
	dagentV1 "ibofdagent/server/routers/mtool/api/dagent/v1"
	iBoFOSV1 "ibofdagent/server/routers/mtool/api/ibofos/v1"
	"ibofdagent/server/routers/mtool/middleware"
)

func Route(router *gin.Engine) {
	api := router.Group("/mtool/api")
	api.Use(middleware.CheckBasicAuth())
	api.Use(middleware.CheckAPIAtivate())
	api.Use(middleware.CheckMtoolHeader())
	api.Use(middleware.CheckBody())

	apiDagentV1 := api.Group("/dagent/v1")
	{
		apiDagentV1.GET("/ping", dagentV1.Ping)
		apiDagentV1.POST("/ibofos", dagentV1.RunIBoF)
		apiDagentV1.DELETE("/ibofos", dagentV1.ForceKillIbof)
	}

	apiIBoFOSV1 := api.Group("/ibofos/v1")
	apiIBoFOSV1.Use(middleware.CheckiBoFRun())
	// Test API
	{
		apiIBoFOSV1.POST("/test/report", iBoFOSV1.ReportTest)
	}

	// System
	{
		apiIBoFOSV1.GET("/system/sysstate", iBoFOSV1.Sysstate)
		apiIBoFOSV1.GET("/system/exit", iBoFOSV1.ExitSystem)
	}

	// Device
	{ ///
		apiIBoFOSV1.GET("/device", iBoFOSV1.ListDevice)
		apiIBoFOSV1.GET("/device/scan", iBoFOSV1.ScanDevice)
		apiIBoFOSV1.POST("/device/attach", iBoFOSV1.AttachDevice)
		apiIBoFOSV1.DELETE("/device/detach", iBoFOSV1.DetachDevice)
	}

	// Array
	{
		apiIBoFOSV1.POST("/array", iBoFOSV1.CreateArray)
		apiIBoFOSV1.GET("/array", iBoFOSV1.StatusArray)
		apiIBoFOSV1.DELETE("/array", iBoFOSV1.DeleteArray)
		apiIBoFOSV1.POST("/array/mount", iBoFOSV1.MountArray)
		apiIBoFOSV1.DELETE("/array/mount", iBoFOSV1.UnmountArray)
	}

	// Volume
	{
		apiIBoFOSV1.POST("/volume", iBoFOSV1.CreateVolume)
		apiIBoFOSV1.GET("/volume", iBoFOSV1.ListVolume)
		apiIBoFOSV1.PUT("/volume", iBoFOSV1.UpdateVolume)
		apiIBoFOSV1.DELETE("/volume", iBoFOSV1.DeleteVolume)
		apiIBoFOSV1.POST("/volume/mount", iBoFOSV1.MountVolume)
		apiIBoFOSV1.DELETE("/volume/mount", iBoFOSV1.UnmountVolume)
	}
}
