package m9k

import (
	"a-module/routers/m9k/api/exec"
	iBoFOS "a-module/routers/m9k/api/ibofos"
	mAgent "a-module/routers/m9k/api/magent"
	"a-module/routers/m9k/model"
	"dagent/src/routers/m9k/api/dagent"
	"dagent/src/routers/m9k/api/ibofos"
	"dagent/src/routers/m9k/api/magent"
	"dagent/src/routers/m9k/middleware"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Route(router *gin.Engine) {
	uri := router.Group("/api")

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
			deviceName := ctx.Param("deviceName")
			param := model.DeviceParam{Name: deviceName}
			ibofos.CalliBoFOSwithParam(ctx, iBoFOS.GetSMART, param)
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
	
	// MAgentPath
	mAgentPath := uri.Group("/magentmetrics/v1")
	{
		mAgentPath.GET("/cpu/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, mAgent.GetCPUData, param)
		})
		mAgentPath.GET("/cpu/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, mAgent.GetCPUData, param)
		})
		mAgentPath.GET("/disk/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, mAgent.GetDiskData, param)
		})

		mAgentPath.GET("/disk/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, mAgent.GetDiskData, param)
		})

		mAgentPath.GET("/memory/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, mAgent.GetMemoryData, param)
		})

		mAgentPath.GET("/memory/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, mAgent.GetMemoryData, param)
		})

		mAgentPath.GET("/network/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, mAgent.GetNetData, param)
		})

		mAgentPath.GET("/network/:networkfield", func(ctx *gin.Context) {
			networkfield := ctx.Param("networkfield")
			if networkfield == "driver" {
				param := model.MAgentParam{}
				magent.CallMagent(ctx, mAgent.GetNetDriver, param)
			} else if networkfield == "hardwareaddress" {
				param := model.MAgentParam{}
				magent.CallMagent(ctx, mAgent.GetNetAddress, param)
			} else {
				param := model.MAgentParam{Time: networkfield}
				magent.CallMagent(ctx, mAgent.GetNetData, param)
			}
		})
	}
}

// ToDd : This Route path must be removed after mtool fix
func RouteLegacy(router *gin.Engine) {
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
			deviceName := ctx.Param("deviceName")
			param := model.DeviceParam{Name: deviceName}
			ibofos.CalliBoFOSwithParam(ctx, iBoFOS.GetSMART, param)
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
	// MAgentPath
	mAgentPath := uri.Group("/magentmetrics/v1")
	{
		mAgentPath.GET("/cpu/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, mAgent.GetCPUData, param)
		})
		mAgentPath.GET("/cpu/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, mAgent.GetCPUData, param)
		})
		mAgentPath.GET("/disk/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, mAgent.GetDiskData, param)
		})

		mAgentPath.GET("/disk/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, mAgent.GetDiskData, param)
		})

		mAgentPath.GET("/memory/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, mAgent.GetMemoryData, param)
		})

		mAgentPath.GET("/memory/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, mAgent.GetMemoryData, param)
		})

		mAgentPath.GET("/network/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, mAgent.GetNetData, param)
		})

		mAgentPath.GET("/network/:networkfield", func(ctx *gin.Context) {
			networkfield := ctx.Param("networkfield")
			if networkfield == "driver" {
				param := model.MAgentParam{}
				magent.CallMagent(ctx, mAgent.GetNetDriver, param)
			} else if networkfield == "hardwareaddress" {
				param := model.MAgentParam{}
				magent.CallMagent(ctx, mAgent.GetNetAddress, param)
			} else {
				param := model.MAgentParam{Time: networkfield}
				magent.CallMagent(ctx, mAgent.GetNetData, param)
			}
		})
	}
}
