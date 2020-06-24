package m9k

import (
	"a-module/routers/m9k/api/exec"
	amoduleIBoFOS "a-module/routers/m9k/api/ibofos"
	amoduleMagent "a-module/routers/m9k/api/magent"
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
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.RuniBoFOS)
		})
		iBoFOSPath.DELETE("/system/ibofos", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ExitiBoFOS)
		})
		iBoFOSPath.GET("/system", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.IBoFOSInfo)
		})
		iBoFOSPath.POST("/system/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.MountiBoFOS)
		})
		iBoFOSPath.DELETE("/system/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.UnmountiBoFOS)
		})
		iBoFOSPath.DELETE("/system/disk/", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.DetachDevice)
		})
	}

	// Device
	{
		iBoFOSPath.GET("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ListDevice)
		})
		iBoFOSPath.GET("/device/scan", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ScanDevice)
		})
		iBoFOSPath.POST("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.AddDevice)
		})
		iBoFOSPath.DELETE("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.RemoveDevice)
		})
		iBoFOSPath.GET("/device/smart/:deviceName", func(ctx *gin.Context) {
			// GET Method does not support payload
			deviceName := ctx.Param("deviceName")
			param := model.DeviceParam{Name: deviceName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.GetSMART, param)
		})
	}

	// Array
	{
		iBoFOSPath.GET("/array/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ListArrayDevice)
		})
		iBoFOSPath.GET("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.LoadArray)
		})
		iBoFOSPath.POST("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.CreateArray)
		})
		iBoFOSPath.DELETE("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.DeleteArray)
		})
	}

	// Volume
	{
		iBoFOSPath.POST("/volume", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, amoduleIBoFOS.CreateVolume, &multiVolRes, dagent.CREATE_VOLUME)
			} else {
				ibofos.CalliBoFOS(ctx, amoduleIBoFOS.CreateVolume)
			}
		})
		iBoFOSPath.GET("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ListVolume)
		})
		iBoFOSPath.PUT("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.UpdateVolume)
		})
		iBoFOSPath.DELETE("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.DeleteVolume)
		})
		iBoFOSPath.GET("/volume/maxcount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.GetMaxVolumeCount)
		})
		iBoFOSPath.POST("/volume/mount", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, amoduleIBoFOS.MountVolume, &multiVolRes, dagent.MOUNT_VOLUME)
			} else {
				ibofos.CalliBoFOS(ctx, amoduleIBoFOS.MountVolume)
			}
		})
		iBoFOSPath.DELETE("/volume/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.UnmountVolume)
		})
	}

	// MAgentPath
	mAgentPath := uri.Group("/metrics/v1")
	{
		mAgentPath.GET("/cpu/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetCPUData, param)
		})
		mAgentPath.GET("/cpu/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, amoduleMagent.GetCPUData, param)
		})
		mAgentPath.GET("/disk/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetDiskData, param)
		})

		mAgentPath.GET("/disk/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, amoduleMagent.GetDiskData, param)
		})

		mAgentPath.GET("/memory/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetMemoryData, param)
		})

		mAgentPath.GET("/memory/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, amoduleMagent.GetMemoryData, param)
		})

		mAgentPath.GET("/network/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetNetData, param)
		})

		mAgentPath.GET("/network/:networkfield", func(ctx *gin.Context) {
			networkfield := ctx.Param("networkfield")
			if networkfield == "driver" {
				param := model.MAgentParam{}
				magent.CallMagent(ctx, amoduleMagent.GetNetDriver, param)
			} else if networkfield == "hardwareaddress" {
				param := model.MAgentParam{}
				magent.CallMagent(ctx, amoduleMagent.GetNetAddress, param)
			} else {
				param := model.MAgentParam{Time: networkfield}
				magent.CallMagent(ctx, amoduleMagent.GetNetData, param)
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
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.RuniBoFOS)
		})
		iBoFOSPath.DELETE("/system/ibofos", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ExitiBoFOS)
		})
		iBoFOSPath.GET("/system", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.IBoFOSInfo)
		})
		iBoFOSPath.POST("/system/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.MountiBoFOS)
		})
		iBoFOSPath.DELETE("/system/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.UnmountiBoFOS)
		})
		iBoFOSPath.DELETE("/system/disk/", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.DetachDevice)
		})
	}

	// Device
	{
		iBoFOSPath.GET("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ListDevice)
		})
		iBoFOSPath.GET("/device/scan", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ScanDevice)
		})
		iBoFOSPath.POST("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.AddDevice)
		})
		iBoFOSPath.DELETE("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.RemoveDevice)
		})
		iBoFOSPath.GET("/device/smart/:deviceName", func(ctx *gin.Context) {
			// GET Method does not support payload
			deviceName := ctx.Param("deviceName")
			param := model.DeviceParam{Name: deviceName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.GetSMART, param)
		})
	}

	// Array
	{
		iBoFOSPath.GET("/array/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ListArrayDevice)
		})
		iBoFOSPath.GET("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.LoadArray)
		})
		iBoFOSPath.POST("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.CreateArray)
		})
		iBoFOSPath.DELETE("/array", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.DeleteArray)
		})
	}

	// Volume
	{
		iBoFOSPath.POST("/volume", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, amoduleIBoFOS.CreateVolume, &multiVolRes, dagent.CREATE_VOLUME)
			} else {
				ibofos.CalliBoFOS(ctx, amoduleIBoFOS.CreateVolume)
			}
		})
		iBoFOSPath.GET("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ListVolume)
		})
		iBoFOSPath.PUT("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.UpdateVolume)
		})
		iBoFOSPath.DELETE("/volume", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.DeleteVolume)
		})
		iBoFOSPath.GET("/volume/maxcount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.GetMaxVolumeCount)
		})
		iBoFOSPath.POST("/volume/mount", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, amoduleIBoFOS.MountVolume, &multiVolRes, dagent.MOUNT_VOLUME)
			} else {
				ibofos.CalliBoFOS(ctx, amoduleIBoFOS.MountVolume)
			}
		})
		iBoFOSPath.DELETE("/volume/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.UnmountVolume)
		})
	}

	// MAgentPath
	mAgentPath := uri.Group("/metrics/v1")
	{
		mAgentPath.GET("/cpu/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetCPUData, param)
		})
		mAgentPath.GET("/cpu/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, amoduleMagent.GetCPUData, param)
		})
		mAgentPath.GET("/disk/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetDiskData, param)
		})

		mAgentPath.GET("/disk/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, amoduleMagent.GetDiskData, param)
		})

		mAgentPath.GET("/memory/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetMemoryData, param)
		})

		mAgentPath.GET("/memory/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, amoduleMagent.GetMemoryData, param)
		})

		mAgentPath.GET("/network/", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetNetData, param)
		})

		mAgentPath.GET("/network/:networkfield", func(ctx *gin.Context) {
			networkfield := ctx.Param("networkfield")
			if networkfield == "driver" {
				param := model.MAgentParam{}
				magent.CallMagent(ctx, amoduleMagent.GetNetDriver, param)
			} else if networkfield == "hardwareaddress" {
				param := model.MAgentParam{}
				magent.CallMagent(ctx, amoduleMagent.GetNetAddress, param)
			} else {
				param := model.MAgentParam{Time: networkfield}
				magent.CallMagent(ctx, amoduleMagent.GetNetData, param)
			}
		})
	}
}
