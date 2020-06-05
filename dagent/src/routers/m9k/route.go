package m9k

import (
	"a-module/routers/m9k/api/exec"
	iBoFOS "a-module/routers/m9k/api/ibofos"
	"a-module/routers/m9k/model"
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
			dagent.DagentLogic(ctx, dagent.HeartBeat)
		})
		dagentPath.GET("/version", func(ctx *gin.Context) {
			dagent.DagentLogic(ctx, dagent.Version)
		})
		dagentPath.GET("/statuscode", func(ctx *gin.Context) {
			dagent.DagentLogic(ctx, dagent.StatusCode)
		})
		dagentPath.DELETE("/dagent", func(ctx *gin.Context) {
			dagent.DagentLogic(ctx, dagent.KillDAgent)
		})
		dagentPath.DELETE("/ibofos", func(ctx *gin.Context) {
			dagent.DagentLogic(ctx, exec.ForceKillIbof)
		})
	}

	// iBoFOSPath
	iBoFOSPath := uri.Group("/ibofos/v1")
	iBoFOSPath.Use(middleware.PostHandler)

	// System
	{
		param := model.DeviceParam{}

		iBoFOSPath.POST("/system/ibofos", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.RuniBoFOS, param)
		})
		iBoFOSPath.DELETE("/system/ibofos", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.ExitiBoFOS, param)
		})
		iBoFOSPath.GET("/system", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.IBoFOSInfo, param)
		})
		iBoFOSPath.POST("/system/mount", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.MountiBoFOS, param)
		})
		iBoFOSPath.DELETE("/system/mount", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.UnmountiBoFOS, param)
		})
		iBoFOSPath.DELETE("/system/disk/", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.DetachDevice, param)
		})
	}

	// Device
	{
		param := model.DeviceParam{}

		iBoFOSPath.GET("/device", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.ListDevice, param)
		})
		iBoFOSPath.GET("/device/scan", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.ScanDevice, param)
		})
		iBoFOSPath.POST("/device", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.AddDevice, param)
		})
		iBoFOSPath.DELETE("/device", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.RemoveDevice, param)
		})
	}

	// Array
	{
		param := model.ArrayParam{}

		iBoFOSPath.GET("/array/device", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.ListArrayDevice, param)
		})
		iBoFOSPath.GET("/array", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.LoadArray, param)
		})
		iBoFOSPath.POST("/array", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.CreateArray, param)
		})
		iBoFOSPath.DELETE("/array", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.DeleteArray, param)
		})
	}

	// Volume
	{
		param := model.VolumeParam{}
		iBoFOSPath.POST("/volume", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, iBoFOS.CreateVolume, &multiVolRes, dagent.CREATE_VOLUME)
			} else {
				ibofos.AmoduleLogic(ctx, iBoFOS.CreateVolume, param)
			}
		})
		iBoFOSPath.GET("/volume", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.ListVolume, param)
		})
		iBoFOSPath.PUT("/volume", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.UpdateVolume, param)
		})
		iBoFOSPath.DELETE("/volume", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.DeleteVolume, param)
		})
		iBoFOSPath.GET("/volume/maxcount", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.GetMaxVolumeCount, param)
		})
		iBoFOSPath.POST("/volume/mount", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, iBoFOS.MountVolume, &multiVolRes, dagent.MOUNT_VOLUME)
			} else {
				ibofos.AmoduleLogic(ctx, iBoFOS.MountVolume, param)
			}
		})
		iBoFOSPath.DELETE("/volume/mount", func(ctx *gin.Context) {
			ibofos.AmoduleLogic(ctx, iBoFOS.UnmountVolume, param)
		})
	}
}
