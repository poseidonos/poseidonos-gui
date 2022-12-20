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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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
	"dagent/src/routers/m9k/api/caller"
	"dagent/src/routers/m9k/api/dagent"
	"dagent/src/routers/m9k/api/ibofos"
	"dagent/src/routers/m9k/api/ibofos_"
	"dagent/src/routers/m9k/middleware"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"kouros/model"
	"kouros/utils"
	"net/http"
	"os"
	"path/filepath"
	amoduleIBoFOS "pnconnector/src/routers/m9k/api/ibofos"
	//"pnconnector/src/routers/m9k/model"
	"dagent/src/routers/m9k/globals"
	"kouros"
	pos "kouros/pos"
	"kouros/setting"
	"reflect"
	"strings"
	"time"
)

func Route(router *gin.Engine) {
	uri := router.Group("/api")
	posMngr, _ := kouros.NewPOSManager(pos.GRPC)
	posMngr.Init(model.RequesterName, setting.Config.Server.IBoF.IP+":"+setting.Config.Server.IBoF.GrpcPort)

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
			dagent.CallDagent(ctx, dagent.ForceKillIbof)
		})
	}

	// iBoFOSPath
	iBoFOSPath := uri.Group("/ibofos/v1")
	iBoFOSPath.Use(middleware.PostHandler)

	// System
	{
		iBoFOSPath.POST("/system", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallStartPoseidonOS, posMngr)
		})
		iBoFOSPath.DELETE("/system", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallStopPoseidonOS, posMngr)
		})
		iBoFOSPath.GET("/system", func(ctx *gin.Context) {
			globals.Temptime = time.Now().UTC().Unix()
			if globals.InitialTime+globals.TimeLimit < globals.Temptime {
				ibofos.CalliBoFOS(ctx, caller.CallGetSystemInfo, posMngr)
			} else {
				ctx.AbortWithStatusJSON(http.StatusOK, &globals.InitialRes)

			}
		})
		iBoFOSPath.POST("/system/property", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallSetSystemProperty, posMngr)
		})
		iBoFOSPath.GET("/system/property", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallGetSystemProperty, posMngr)
		})
	}

	// Device
	{

		iBoFOSPath.GET("/devices", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallListDevices, posMngr)
		})
		iBoFOSPath.POST("/device", func(ctx *gin.Context) {
			if validateUint32(ctx, "blockSize", 2423) && validateUint32(ctx, "numBlocks", 2424) && validateUint32(ctx, "numa", 2425) {
				ibofos.CalliBoFOS(ctx, caller.CallCreateDevice, posMngr)
			}

		})
		iBoFOSPath.GET("/devices/:deviceName/scan", func(ctx *gin.Context) {
			deviceName := ctx.Param("deviceName")
			if deviceName == "all" {
				ibofos.CalliBoFOS(ctx, caller.CallScanDevice, posMngr)
			} else {
				// 404 return
			}
		})
		iBoFOSPath.GET("/devices/:deviceName/smart", func(ctx *gin.Context) {
			deviceName := ctx.Param("deviceName")
			param := model.DeviceParam{Name: deviceName}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallGetDeviceSmartLog, param, posMngr)
		})
	}

	// Array
	{
		iBoFOSPath.POST("/array", func(ctx *gin.Context) {
			if validateNumOfDevice(ctx) {
				param := model.ArrayParam{}
				param.Name = ctx.Param("arrayName")
				ibofos.CalliBoFOSwithParam(ctx, caller.CallCreateArray, param, posMngr)

			}
		})
		iBoFOSPath.POST("/autoarray", func(ctx *gin.Context) {
			if validateNumOfDevice(ctx) {
				param := model.AutocreateArrayParam{}
				ibofos.CalliBoFOSwithParam(ctx, caller.CallAutoCreateArray, param, posMngr)
			}
		})
		iBoFOSPath.GET("/array/:arrayName", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Name = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, caller.CallArrayInfo, param, posMngr)
		})
		iBoFOSPath.GET("/arrays", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallListArray, param, posMngr)
		})
		iBoFOSPath.POST("/array/:arrayName/mount", func(ctx *gin.Context) {
			arrayName := ctx.Param("arrayName")
			param := model.ArrayParam{Name: arrayName}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallMountArray, param, posMngr)
		})
		iBoFOSPath.DELETE("/array/:arrayName/mount", func(ctx *gin.Context) {
			arrayName := ctx.Param("arrayName")
			param := model.ArrayParam{Name: arrayName}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallUnmountArray, param, posMngr)
		})
		iBoFOSPath.GET("/arrays/reset", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallResetMBR, param, posMngr)
		})

		iBoFOSPath.DELETE("/array/:arrayName", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Name = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, caller.CallDeleteArray, param, posMngr)
		})
		iBoFOSPath.POST("/array/:arrayName/devices", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Array = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, caller.CallAddDevice, param, posMngr)
		})
		iBoFOSPath.POST("/array/:arrayName/replace", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Array = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, caller.CallReplaceArrayDevice, param, posMngr)
		})
		iBoFOSPath.DELETE("/array/:arrayName/devices/:deviceName", func(ctx *gin.Context) {
			param := model.ArrayParam{}
			param.Array = ctx.Param("arrayName")
			param.Spare = []model.Device{{DeviceName: ctx.Param("deviceName")}}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallRemoveDevice, param, posMngr)

		})
		iBoFOSPath.POST("/array/:arrayName/rebuild", func(ctx *gin.Context) {
			param := model.RebuildArrayRequest_Param{}
			param.Name = ctx.Param("arrayName")
			ibofos.CalliBoFOSwithParam(ctx, caller.CallRebuildArray, param, posMngr)
		})
	}
	//Subsystem
	{
		iBoFOSPath.POST("/transport", func(ctx *gin.Context) {
			param := model.SubSystemParam{}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallCreateTransport, param, posMngr)
		})

		iBoFOSPath.POST("/listener", func(ctx *gin.Context) {
			param := model.SubSystemParam{}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallAddListener, param, posMngr)
		})
		iBoFOSPath.GET("/subsystem", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallListSubsystem, posMngr)
		})
		iBoFOSPath.POST("/subsystem", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallCreateSubsystem, posMngr)
		})
		iBoFOSPath.POST("/subsysteminfo", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallSubsystemInfo, posMngr)
		})
		iBoFOSPath.DELETE("/subsystem", func(ctx *gin.Context) {
			param := model.SubSystemParam{}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallDeleteSubsystem, param, posMngr)
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
					res.Result.Status, _ = utils.GetStatusInfo(11060)
					ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
					return

				}
				if reflect.TypeOf(reqMap["size"]).Kind() == reflect.String || reqMap["size"].(float64) <= 0 {
					res.Result.Status, _ = utils.GetStatusInfo(2033)
					ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
					return

				}
				dagent.ImplementAsyncMultiVolume(ctx, amoduleIBoFOS.CreateVolume, &multiVolRes, dagent.CREATE_VOLUME)
			} else {
				ibofos.CalliBoFOS(ctx, caller.CallCreateVolume, posMngr)
			}
		})

		iBoFOSPath.GET("/volumelist/:arrayName", func(ctx *gin.Context) {
			arrayName := ctx.Param("arrayName")
			param := model.VolumeParam{Array: arrayName}
			ibofos_.CalliBoFOSwithParam_(ctx, amoduleIBoFOS.ListVolume, param)
		})
		iBoFOSPath.GET("/array/:arrayName/volume/:volumeName", func(ctx *gin.Context) {
			arrayName := ctx.Param("arrayName")
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Array: arrayName, Name: volumeName}
			ibofos_.CalliBoFOSwithParam_(ctx, amoduleIBoFOS.VolumeInfo, param)
		})
		iBoFOSPath.PATCH("/volumes/:volumeName", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos_.CalliBoFOSwithParam_(ctx, amoduleIBoFOS.RenameVolume, param)
		})
		iBoFOSPath.GET("/volumes/maxcount", func(ctx *gin.Context) {
			ibofos_.CalliBoFOS_(ctx, amoduleIBoFOS.GetMaxVolumeCount)
		})
		iBoFOSPath.DELETE("/volumes/:volumeName", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallDeleteVolume, param, posMngr)
		})
		iBoFOSPath.POST("/volumes/:volumeName/mount", func(ctx *gin.Context) {
			if multiVolRes, ok := dagent.IsMultiVolume(ctx); ok {
				dagent.ImplementAsyncMultiVolume(ctx, amoduleIBoFOS.MountVolume, &multiVolRes, dagent.MOUNT_VOLUME)
			} else {
				volumeName := ctx.Param("volumeName")
				param := model.VolumeParam{Name: volumeName}
				ibofos_.CalliBoFOSwithParam_(ctx, amoduleIBoFOS.MountVolume, param)
			}
		})
		iBoFOSPath.POST("/volumes/:volumeName/mount/subsystem", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos_.CalliBoFOSwithParam_(ctx, amoduleIBoFOS.MountVolumeWithSubSystem, param)
		})
		iBoFOSPath.DELETE("/volumes/:volumeName/mount", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos.CalliBoFOSwithParam(ctx, caller.CallUnmountVolume, param, posMngr)
		})
		iBoFOSPath.PATCH("/volumes/:volumeName/qos", func(ctx *gin.Context) {
			volumeName := ctx.Param("volumeName")
			param := model.VolumeParam{Name: volumeName}
			ibofos_.CalliBoFOSwithParam_(ctx, amoduleIBoFOS.UpdateVolumeQoS, param)
		})
		iBoFOSPath.POST("/volume/property", func(ctx *gin.Context) {
			ibofos.CalliBoFOS(ctx, caller.CallVolumeProperty, posMngr)
		})

	}
	//QOS
	iBoFOSPath.POST("/qos", func(ctx *gin.Context) {
		ibofos_.CalliBoFOSQOS(ctx, amoduleIBoFOS.QOSCreateVolumePolicies)
	})
	iBoFOSPath.POST("/qos/reset", func(ctx *gin.Context) {
		ibofos_.CalliBoFOS_(ctx, amoduleIBoFOS.QOSResetVolumePolicies)
	})
	iBoFOSPath.POST("/qos/policies", func(ctx *gin.Context) {
		ibofos_.CalliBoFOS_(ctx, amoduleIBoFOS.QOSListPolicies)
	})

	//Telemetry
	iBoFOSPath.POST("/telemetry", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallStartTelemetry, posMngr)
	})
	iBoFOSPath.DELETE("/telemetry", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallStopTelemetry, posMngr)
	})
	iBoFOSPath.POST("/telemetry/properties/path", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallSetTelemetryProperty, posMngr)
	})
	iBoFOSPath.GET("/telemetry/properties/path", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallGetTelemetryProperty, posMngr)
	})
	iBoFOSPath.GET("/telemetry/properties", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallReadTelemetryProperty, posMngr)
	})
	iBoFOSPath.POST("/telemetry/properties", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallWriteTelemetryProperty, posMngr)
	})

	// Logger Commands
	iBoFOSPath.POST("/logger/filter", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallApplyLogFilter, posMngr)
	})
	iBoFOSPath.GET("/logger/info", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallLoggerInfo, posMngr)
	})
	iBoFOSPath.POST("/logger/level", func(ctx *gin.Context) {
		level := ctx.Param("level")
		param := model.LoggerParam{Level: level}
		ibofos.CalliBoFOSwithParam(ctx, caller.CallSetLogLevel, param, posMngr)
	})
	iBoFOSPath.GET("/logger/level", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallGetLogLevel, posMngr)
	})
	iBoFOSPath.POST("/logger/preference", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallSetLogPreference, posMngr)
	})

	// Developer Commands
	iBoFOSPath.POST("/devel/event-wrr/reset", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallResetEventWRRPolicy, posMngr)
	})
	iBoFOSPath.POST("/devel/event-wrr/update", func(ctx *gin.Context) {
		ibofos.CalliBoFOS(ctx, caller.CallUpdateEventWRRPolicy, posMngr)

	})
	iBoFOSPath.DELETE("/devel/:arrayName/rebuild", func(ctx *gin.Context) {
		arrayName := ctx.Param("arrayName")
		param := model.ArrayParam{Name: arrayName}
		ibofos.CalliBoFOSwithParam(ctx, caller.CallStopRebuilding, param, posMngr)
	})

}
func validateNumOfDevice(ctx *gin.Context) bool {
	req := model.Request{}
	var numOfDevice int
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	reqMap := req.Param.(map[string]interface{})
	res := model.Response{}
	if _, ok := reqMap["data"]; ok {
		numOfDevice = len(reqMap["data"].([]interface{}))
	} else {
		if _, ok := reqMap["numData"]; ok {
			numOfDevice = int(reqMap["numData"].(float64))
		}
	}
	if _, ok := reqMap["raidtype"]; ok {
		if reflect.TypeOf(reqMap["raidtype"]).Kind() == reflect.String && strings.ToLower(reqMap["raidtype"].(string)) == "raid10" && numOfDevice%2 != 0 {
			res.Result.Status, _ = utils.GetStatusInfo(2517)
			ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
			return false
		}
	}
	return true
}

// below validation function is temporary code, will keep this validation on POS side
func validateUint32(ctx *gin.Context, key string, code int) bool {
	req := model.Request{}
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	reqMap := req.Param.(map[string]interface{})
	res := model.Response{}
	_, found := reqMap[key]
	if !found {
		res.Result.Status, _ = utils.GetStatusInfo(2426)
		res.Result.Status.PosDescription = res.Result.Status.Description
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
		return false
	}

	if reflect.TypeOf(reqMap[key]).Kind() == reflect.String || reqMap[key].(float64) < 0 || reqMap[key].(float64) > 4294967295 {
		res.Result.Status, _ = utils.GetStatusInfo(code)
		res.Result.Status.PosDescription = res.Result.Status.Description
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, &res)
		return false
	}
	return true

}
