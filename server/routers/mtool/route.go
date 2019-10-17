package mtool

import (
	"github.com/gin-gonic/gin"
	dagentV1 "ibofdagent/server/routers/mtool/api/dagent/v1"
	iBoFOSV1 "ibofdagent/server/routers/mtool/api/ibofos/v1"
	"ibofdagent/server/routers/mtool/middleware"
)

func Route(router *gin.Engine) {
	uri := router.Group("/mtool/uri")
	//uri.Use(middleware.CheckBasicAuth())
	//uri.Use(middleware.CheckAPIActivate())
	uri.Use(middleware.CheckHeader())
	uri.Use(middleware.CheckBody())
	uri.Use(middleware.ReponseHeader())

	// D-Agent
	dagent := uri.Group("/dagent/v1")
	{
		dagent.GET("/ping", dagentV1.Ping)
		dagent.GET("/statuscode", dagentV1.StatusCode)
		dagent.POST("/ibofos", dagentV1.RunIBoF)
		dagent.DELETE("/ibofos", dagentV1.ForceKillIbof)
	}

	// For Test
	{
		dagent.GET("/test/fio", dagentV1.RunFio)
	}

	// iBoFOS
	iBoFOS := uri.Group("/ibofos/v1")
	iBoFOS.Use(middleware.CheckiBoFRun())

	// For Test
	{
		iBoFOS.POST("/test/report", iBoFOSV1.ReportTest)
	}

	// System
	{
		iBoFOS.GET("/system/sysstate", iBoFOSV1.Sysstate)
		iBoFOS.GET("/system/exit", iBoFOSV1.ExitSystem)
	}

	// Device
	{
		iBoFOS.GET("/device", iBoFOSV1.ListDevice)
		iBoFOS.GET("/device/scan", iBoFOSV1.ScanDevice)
		iBoFOS.POST("/device/attach", iBoFOSV1.AttachDevice)
		iBoFOS.DELETE("/device/detach", iBoFOSV1.DetachDevice)
	}

	// Array
	{
		iBoFOS.GET("/array/device", iBoFOSV1.ListArrayDevice)
		iBoFOS.POST("/array", iBoFOSV1.CreateArray)
		iBoFOS.GET("/array", iBoFOSV1.StateArray)
		iBoFOS.DELETE("/array", iBoFOSV1.DeleteArray)
		iBoFOS.POST("/array/mount", iBoFOSV1.MountArray)
		iBoFOS.DELETE("/array/mount", iBoFOSV1.UnmountArray)
	}

	// Volume
	{
		iBoFOS.POST("/volume", iBoFOSV1.CreateVolume)
		iBoFOS.GET("/volume", iBoFOSV1.ListVolume)
		iBoFOS.PUT("/volume", iBoFOSV1.UpdateVolume)
		iBoFOS.DELETE("/volume", iBoFOSV1.DeleteVolume)
		iBoFOS.POST("/volume/mount", iBoFOSV1.MountVolume)
		iBoFOS.DELETE("/volume/mount", iBoFOSV1.UnmountVolume)
	}
}
