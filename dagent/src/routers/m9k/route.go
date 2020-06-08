package m9k

import (
	"a-module/routers/m9k/api/exec"
	iBoFOS "a-module/routers/m9k/api/ibofos"
	"dagent/src/routers/m9k/api/dagent"
	"dagent/src/routers/m9k/api/ibofos"
	"dagent/src/routers/m9k/middleware"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Route(router *gin.Engine) {
	// This URI should be changed /api, remove /mtool
	uri := router.Group("/mtool/api")

	// Doc Static
	uri.StaticFS("/dagent/v1/doc", http.Dir("./doc"))

	//uri.Use(middleware.CheckBasicAuth())
	//uri.Use(middleware.CheckAPIActivate())
	uri.Use(middleware.CheckHeader)
	uri.Use(middleware.CheckBody)
	uri.Use(middleware.ResponseHeader)

	// D-Agent
	dagentPath := uri.Group("/dagent/v1")
	{
		dagentPath.GET("/heartbeat", func(ctx *gin.Context) {
			dagent.CallDagent(ctx, dagent.HeartBeat)
		})
		dagentPath.GET("/version", func(ctx *gin.Context) {
			dagent.CallDagent(ctx, dagent.Version)
		})
		dagentPath.GET("/statuscode", func(ctx *gin.Context) {
			dagent.CallDagent(ctx, dagent.StatusCode)
		})
		dagentPath.DELETE("/dagent", func(ctx *gin.Context) {
			dagent.CallDagent(ctx, dagent.KillDAgent)
		})
		dagentPath.DELETE("/ibofos", func(ctx *gin.Context) {
			dagent.CallDagent(ctx, exec.ForceKillIbof)
		})
	}

	// iBoFOSPath
	iBoFOSPath := uri.Group("/ibofos/v1")
	iBoFOSPath.Use(middleware.PostHandler)

	// System
	{
		iBoFOSPath.POST("/system/ibofos", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.RuniBoFOS)
		})
		iBoFOSPath.DELETE("/system/ibofos", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.ExitiBoFOS)
		})
		iBoFOSPath.GET("/system", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.IBoFOSInfo)
		})
		iBoFOSPath.POST("/system/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.MountiBoFOS)
		})
		iBoFOSPath.DELETE("/system/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.UnmountiBoFOS)
		})
		iBoFOSPath.DELETE("/system/disk/", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.DetachDevice)
		})
	}

	// Device
	{
		iBoFOSPath.GET("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.ListDevice)
		})
		iBoFOSPath.GET("/device/scan", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.ScanDevice)
		})
		iBoFOSPath.POST("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.AddDevice)
		})
		iBoFOSPath.DELETE("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.RemoveDevice)
		})
		iBoFOSPath.GET("/device/smart/:deviceName", func(ctx *gin.Context) {
			// GET Method does not support payload
			//deviceName := ctx.Param("deviceName")
			ibofos.CalliBoFOS(ctx, iBoFOS.GetSMART)
		})
	}

	// Array
	{
		iBoFOSPath.GET("/array/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.ListArrayDevice)
		})
		iBoFOSPath.GET("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.LoadArray)
		})
		iBoFOSPath.POST("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.CreateArray)
		})
		iBoFOSPath.DELETE("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.DeleteArray)
		})
	}

	// Volume
	{
		iBoFOSPath.POST("/volume", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, iBoFOS.CreateVolume, &multiVolRes, dagent.CREATE_VOLUME)
			} else {
				ibofos.CalliBoFOS(ctx, iBoFOS.CreateVolume)
			}
		})
		iBoFOSPath.GET("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.ListVolume)
		})
		iBoFOSPath.PUT("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.UpdateVolume)
		})
		iBoFOSPath.DELETE("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.DeleteVolume)
		})
		iBoFOSPath.GET("/volume/maxcount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.GetMaxVolumeCount)
		})
		iBoFOSPath.POST("/volume/mount", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, iBoFOS.MountVolume, &multiVolRes, dagent.MOUNT_VOLUME)
			} else {
				ibofos.CalliBoFOS(ctx, iBoFOS.MountVolume)
			}
		})
		iBoFOSPath.DELETE("/volume/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, iBoFOS.UnmountVolume)
		})
	}
}
