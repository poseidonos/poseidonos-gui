package mtool

import (
	"github.com/gin-gonic/gin"
	dagentV1 "A-module/routers/mtool/api/dagent/v1"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/middleware"
	"net/http"
)

func Route(router *gin.Engine) {
	uri := router.Group("/mtool/api")

	// Doc Static
	uri.StaticFS("/dagent/v1/doc", http.Dir("./doc"))

	//uri.Use(middleware.CheckBasicAuth())
	//uri.Use(middleware.CheckAPIActivate())
	uri.Use(middleware.CheckHeader)
	uri.Use(middleware.CheckBody)
	uri.Use(middleware.ReponseHeader)

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
		iBoFOS.GET("/system/heartbeat", iBoFOSV1.Heartbeat)
		iBoFOS.DELETE("/system/exitibofos", iBoFOSV1.ExitiBoFOS)
		iBoFOS.GET("/system", iBoFOSV1.IBoFOSInfo)
		iBoFOS.POST("/system/mount", iBoFOSV1.MountiBoFOS)
		iBoFOS.DELETE("/system/mount", iBoFOSV1.UnmountiBoFOS)
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
		iBoFOS.GET("/array", iBoFOSV1.LoadArray)
		iBoFOS.POST("/array", iBoFOSV1.CreateArray)
		iBoFOS.DELETE("/array", iBoFOSV1.DeleteArray)
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
