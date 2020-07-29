package m9k

import (
	"a-module/src/routers/m9k/api/exec"
	amoduleIBoFOS "a-module/src/routers/m9k/api/ibofos"
	amoduleMagent "a-module/src/routers/m9k/api/magent"
	"a-module/src/routers/m9k/model"
	"dagent/src/routers/m9k/api/dagent"
	"dagent/src/routers/m9k/api/ibofos"
	"dagent/src/routers/m9k/api/magent"
	"dagent/src/routers/m9k/middleware"
	"github.com/gin-gonic/gin"
	"net/http"
)

func RouteLegacy(router *gin.Engine) {
	uri := router.Group("/api")

	// Doc Static
	uri.StaticFS("/dagent/v1/doc", http.Dir("/root/workspace/m9k/dagent/doc"))

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
	mAgentPath := uri.Group("/metric/v1")
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
			magent.CallMagent(ctx, amoduleMagent.GetDeviceData, param)
		})

		mAgentPath.GET("/disk/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, amoduleMagent.GetDeviceData, param)
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

		mAgentPath.GET("/readbw/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time, Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetReadBandwidth, param)
		})

		mAgentPath.GET("/readbw/", func(ctx *gin.Context) {
			param := model.MAgentParam{Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetReadBandwidth, param)
		})

		mAgentPath.GET("/vol/:volid/readbw/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			volid := ctx.Param("volid")
			param := model.MAgentParam{Time: time, Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetReadBandwidth, param)
		})

		mAgentPath.GET("/vol/:volid/readbw/", func(ctx *gin.Context) {
			volid := ctx.Param("volid")
			param := model.MAgentParam{Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetReadBandwidth, param)
		})

		mAgentPath.GET("/writebw/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time, Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetWriteBandwidth, param)
		})

		mAgentPath.GET("/writebw/", func(ctx *gin.Context) {
			param := model.MAgentParam{Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetWriteBandwidth, param)
		})

		mAgentPath.GET("/vol/:volid/writebw/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			volid := ctx.Param("volid")
			param := model.MAgentParam{Time: time, Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetWriteBandwidth, param)
		})

		mAgentPath.GET("/vol/:volid/writebw/", func(ctx *gin.Context) {
			volid := ctx.Param("volid")
			param := model.MAgentParam{Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetWriteBandwidth, param)
		})

		mAgentPath.GET("/readiops/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time, Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetReadIOPS, param)
		})

		mAgentPath.GET("/readiops/", func(ctx *gin.Context) {
			param := model.MAgentParam{Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetReadIOPS, param)
		})

		mAgentPath.GET("/vol/:volid/readiops/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			volid := ctx.Param("volid")
			param := model.MAgentParam{Time: time, Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetReadIOPS, param)
		})

		mAgentPath.GET("/vol/:volid/readiops/", func(ctx *gin.Context) {
			volid := ctx.Param("volid")
			param := model.MAgentParam{Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetReadIOPS, param)
		})

		mAgentPath.GET("/writeiops/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time, Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetWriteIOPS, param)
		})

		mAgentPath.GET("/writeiops/", func(ctx *gin.Context) {
			param := model.MAgentParam{Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetWriteIOPS, param)
		})

		mAgentPath.GET("/vol/:volid/writeiops/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			volid := ctx.Param("volid")
			param := model.MAgentParam{Time: time, Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetWriteIOPS, param)
		})

		mAgentPath.GET("/vol/:volid/writeiops/", func(ctx *gin.Context) {
			volid := ctx.Param("volid")
			param := model.MAgentParam{Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetWriteIOPS, param)
		})

		mAgentPath.GET("/latency/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time, Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetLatency, param)
		})

		mAgentPath.GET("/latency/", func(ctx *gin.Context) {
			param := model.MAgentParam{Level: "array"}
			magent.CallMagent(ctx, amoduleMagent.GetLatency, param)
		})

		mAgentPath.GET("/vol/:volid/latency/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			volid := ctx.Param("volid")
			param := model.MAgentParam{Time: time, Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetLatency, param)
		})

		mAgentPath.GET("/vol/:volid/latency/", func(ctx *gin.Context) {
			volid := ctx.Param("volid")
			param := model.MAgentParam{Level: volid}
			magent.CallMagent(ctx, amoduleMagent.GetLatency, param)
		})

		mAgentPath.GET("/rebuildlogs/:time", func(ctx *gin.Context) {
			time := ctx.Param("time")
			param := model.MAgentParam{Time: time}
			magent.CallMagent(ctx, amoduleMagent.GetRebuildLogs, param)
		})
	}
}
