/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package m9k

import (
	"dagent/src/routers/m9k/api/dagent"
	"dagent/src/routers/m9k/api/ibofos"
	"dagent/src/routers/m9k/api/magent"
	"dagent/src/routers/m9k/middleware"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"net/http"
	"os"
	"path/filepath"
	"pnconnector/src/routers/m9k/api/exec"
	amoduleIBoFOS "pnconnector/src/routers/m9k/api/ibofos"
	amoduleMagent "pnconnector/src/routers/m9k/api/magent"
	"pnconnector/src/routers/m9k/model"
	"pnconnector/src/util"
	"reflect"
	"strings"
)

func Route(router *gin.Engine) {
	uri := router.Group("/api")

	// Doc Static
	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	dir = strings.ReplaceAll(dir, "/bin", "/doc")
	uri.StaticFS("/dagent/v1/doc", http.Dir(dir))

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
		iBoFOSPath.POST("/system", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.RuniBoFOS)
		})
		iBoFOSPath.DELETE("/system", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ExitiBoFOS)
		})
		iBoFOSPath.POST("/system/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.MountiBoFOS)
		})
		iBoFOSPath.GET("/system", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.IBoFOSInfo)
		})
		iBoFOSPath.DELETE("/system/mount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.UnmountiBoFOS)
		})
	}

	// Device
	{
		//// Temp1
		//iBoFOSPath.POST("/devices", func(ctx *gin.Context) {
		//	// Temp workaround
		//	req := model.Request{}
		//	ctx.ShouldBindBodyWith(&req, binding.JSON)
		//	marshalled, _ := json.Marshal(req.Param)
		//	param := model.DeviceParam{}
		//	_ = json.Unmarshal(marshalled, &param)
		//	param.Spare = param.Spare
		//	ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.AddDevice, param)
		//
		//	//ibofos.CalliBoFOS(ctx, amoduleIBoFOS.AddDevice)
		//})
		//// Temp2
		//iBoFOSPath.DELETE("/devices/:deviceName", func(ctx *gin.Context) {
		//	deviceName := ctx.Param("deviceName")
		//	param := model.DeviceParam{Spare: deviceName}
		//	ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.RemoveDevice, param)
		//})

		iBoFOSPath.GET("/devices", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ListDevice)
		})
		iBoFOSPath.POST("/device", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.CreateDevice)
		})
		iBoFOSPath.GET("/devices/:deviceName/scan", func(ctx *gin.Context) {
			deviceName := ctx.Param("deviceName")
			if deviceName == "all" {
				ibofos.CalliBoFOS(ctx, amoduleIBoFOS.ScanDevice)
			} else {
				// 404 return
			}
		})
		iBoFOSPath.GET("/devices/:deviceName/smart", func(ctx *gin.Context) {
			deviceName := ctx.Param("deviceName")
			param := model.DeviceParam{Name: deviceName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.GetSMART, param)
		})
	}

	// Array
	{
		iBoFOSPath.POST("/array", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Name = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.CreateArray, param)
		})
		iBoFOSPath.POST("/autoarray", func(ctx *gin.Context) {
			param := model.AutocreateArrayParam{}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.AutoCreateArray, param)
		})
		iBoFOSPath.GET("/array/:arrayName", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Name = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.ArrayInfo, param)
		})
		iBoFOSPath.GET("/arrays", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.ListArray, param)
		})
		iBoFOSPath.POST("/array/:arrayName/mount", func(ctx *gin.Context) {
			arrayName := ctx.Param("arrayName")
			param := model.ArrayParam{Name: arrayName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.MountArray, param)
		})
		iBoFOSPath.DELETE("/array/:arrayName/mount", func(ctx *gin.Context) {
			arrayName := ctx.Param("arrayName")
			param := model.ArrayParam{Name: arrayName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.UnmountArray, param)
		})
		iBoFOSPath.GET("/arrays/reset", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.ArrayReset, param)
		})

		iBoFOSPath.DELETE("/array/:arrayName", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Name = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.DeleteArray, param)
		})
		iBoFOSPath.GET("/array/:arrayName/devices", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Name = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.ListArrayDevice, param)
		})
		iBoFOSPath.GET("/array/:arrayName/load", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Name = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.LoadArray, param)
		})
		iBoFOSPath.POST("/array/:arrayName/devices", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Array = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.AddDevice, param)
		})
		iBoFOSPath.DELETE("/array/:arrayName/devices/:deviceName", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Array = ctx.Param("arrayName")
			param.Spare = []model.Device{{DeviceName: ctx.Param("deviceName")}}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.RemoveDevice, param)
		})
	}
	//Subsystem
	{
		iBoFOSPath.POST("/transport", func(ctx *gin.Context) {
			param := model.SubSystemParam{}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.CreateTransport, param)
		})

		iBoFOSPath.POST("/listener", func(ctx *gin.Context) {
			param := model.SubSystemParam{}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.AddListener, param)
		})
		iBoFOSPath.GET("/subsystem", func(ctx *gin.Context) {
			param := model.SubSystemParam{}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.ListSubSystem, param)
		})
		iBoFOSPath.POST("/subsystem", func(ctx *gin.Context) {
			param := model.SubSystemParam{}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.CreateSubSystem, param)
		})
		iBoFOSPath.DELETE("/subsystem", func(ctx *gin.Context) {
			param := model.SubSystemParam{}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.DeleteSubSystem, param)
		})

	}

	// Volume
	{
		iBoFOSPath.POST("/volumes", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				req := model.Request{}
				ctx.ShouldBindBodyWith(&req, binding.JSON)
				reqMap := req.Param.(map[string]interface{})
				res := model.Response{}
				if reflect.TypeOf(reqMap["namesuffix"]).Kind() == reflect.String || reqMap["namesuffix"].(float64) < 0 {
					res.Result.Status, _ = util.GetStatusInfo(11060)
					ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
					return

				}
                                if reflect.TypeOf(reqMap["size"]).Kind() == reflect.String || reqMap["size"].(float64) <= 0 {
                                        res.Result.Status, _ = util.GetStatusInfo(2033)
                                        ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
                                        return

                                }
				dagent.ImplementAsyncMultiVolume(ctx, amoduleIBoFOS.CreateVolume, &multiVolRes, dagent.CREATE_VOLUME)
			} else {
				ibofos.CalliBoFOS(ctx, amoduleIBoFOS.CreateVolume)
			}
		})
		iBoFOSPath.GET("/volumelist/:arrayName", func(ctx *gin.Context) {
			arrayName := ctx.Param("arrayName")
			param := model.VolumeParam{Array: arrayName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.ListVolume, param)
		})
		iBoFOSPath.PATCH("/volumes/:volumeName", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.RenameVolume, param)
		})
		iBoFOSPath.GET("/volumes/maxcount", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, amoduleIBoFOS.GetMaxVolumeCount)
		})
		iBoFOSPath.DELETE("/volumes/:volumeName", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.DeleteVolume, param)
		})
		iBoFOSPath.POST("/volumes/:volumeName/mount", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, amoduleIBoFOS.MountVolume, &multiVolRes, dagent.MOUNT_VOLUME)
			} else {
				volumeName := ctx.Param("volumeName")
				param := model.VolumeParam{Name: volumeName}
				ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.MountVolume, param)
			}
		})
		iBoFOSPath.POST("/volumes/:volumeName/mount/subsystem", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.MountVolumeWithSubsystem, param)
		})
		iBoFOSPath.DELETE("/volumes/:volumeName/mount", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.UnmountVolume, param)
		})
		iBoFOSPath.PATCH("/volumes/:volumeName/qos", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos.CalliBoFOSwithParam(ctx, amoduleIBoFOS.UpdateVolumeQoS, param)
		})
	}
	//QOS
	iBoFOSPath.POST("/qos", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, amoduleIBoFOS.QOSCreateVolumePolicies)
	})
	iBoFOSPath.POST("/qos/reset", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, amoduleIBoFOS.QOSResetVolumePolicies)
	})
	iBoFOSPath.POST("/qos/policies", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, amoduleIBoFOS.QOSListPolicies)
	})

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
		mAgentPath.GET("/devices", func(ctx *gin.Context) {
			param := model.MAgentParam{}
			magent.CallMagent(ctx, amoduleMagent.GetDeviceData, param)
		})

		mAgentPath.GET("/devices/:time", func(ctx *gin.Context) {
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
		//readbw
		mAgentPath.GET("/readbw/arrays", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: ""}
				magent.CallMagent(ctx, amoduleMagent.GetReadBandwidth, param)
			}
		})
		mAgentPath.GET("/readbw/arrays/volumes", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: params.VolumeIds}
				magent.CallMagent(ctx, amoduleMagent.GetReadBandwidth, param)
			}
		})
		//writebw
		mAgentPath.GET("/writebw/arrays", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: ""}
				magent.CallMagent(ctx, amoduleMagent.GetWriteBandwidth, param)
			}
		})
		mAgentPath.GET("/writebw/arrays/volumes", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: params.VolumeIds}
				magent.CallMagent(ctx, amoduleMagent.GetWriteBandwidth, param)
			}
		})
		//readiops
		mAgentPath.GET("/readiops/arrays", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: ""}
				magent.CallMagent(ctx, amoduleMagent.GetReadIOPS, param)
			}
		})
		mAgentPath.GET("/readiops/arrays/volumes", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: params.VolumeIds}
				magent.CallMagent(ctx, amoduleMagent.GetReadIOPS, param)
			}
		})
		//writeiops
		mAgentPath.GET("/writeiops/arrays", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: ""}
				magent.CallMagent(ctx, amoduleMagent.GetWriteIOPS, param)
			}
		})
		mAgentPath.GET("/writeiops/arrays/volumes", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: params.VolumeIds}
				magent.CallMagent(ctx, amoduleMagent.GetWriteIOPS, param)
			}
		})
		//write latency
		mAgentPath.GET("/writelatency/arrays", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: ""}
				magent.CallMagent(ctx, amoduleMagent.GetWriteLatency, param)
			}
		})
		mAgentPath.GET("/writelatency/arrays/volumes", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: params.VolumeIds}
				magent.CallMagent(ctx, amoduleMagent.GetWriteLatency, param)
			}
		})
		//read latency
		mAgentPath.GET("/readlatency/arrays", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: ""}
				magent.CallMagent(ctx, amoduleMagent.GetReadLatency, param)
			}
		})
		mAgentPath.GET("/readlatency/arrays/volumes", func(ctx *gin.Context) {
			var params model.MAgentParam
			if ctx.ShouldBindQuery(&params) == nil {
				param := model.MAgentParam{Time: params.Time, ArrayIds: params.ArrayIds, VolumeIds: params.VolumeIds}
				magent.CallMagent(ctx, amoduleMagent.GetReadLatency, param)
			}
		})

		//rebuildlogs
		mAgentPath.GET("/rebuildlogs", func(ctx *gin.Context) {
                        time := ctx.Param("time")
                        param := model.MAgentParam{Time: time}
                        magent.CallMagent(ctx, amoduleMagent.GetRebuildLogs, param)
                })

	}
}
