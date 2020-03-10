package mtool

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"A-module/routers/mtool/model"
	dagentV1 "A-module/routers/mtool/api/dagent/v1"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"DAgent/src/routers/mtool/api"
	"DAgent/src/routers/mtool/middleware"
	"net/http"
	"encoding/json"
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
		iBoFOS.POST("/test/report", func(c *gin.Context) {
			iBoFOSV1.ReportTest()
		})
	}

	// System
	{
		iBoFOS.GET("/system/heartbeat", func(c *gin.Context) {
			response, err := iBoFOSV1.Heartbeat()
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/system/exitibofos", func(c *gin.Context) {
			response, err := iBoFOSV1.ExitiBoFOS()
			makeResponse(c, response, err)
		})
		iBoFOS.GET("/system", func(c *gin.Context) {
			response, err := iBoFOSV1.IBoFOSInfo()
			makeResponse(c, response, err)
		})
		iBoFOS.POST("/system/mount", func(c *gin.Context) {
			response, err := iBoFOSV1.MountiBoFOS()
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/system/mount", func(c *gin.Context) {
			response, err := iBoFOSV1.UnmountiBoFOS()
			makeResponse(c, response, err)
		})
	}

	// Device
	{
		iBoFOS.GET("/device", func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.DeviceParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.ListDevice(param)
			makeResponse(c, response, err)

		})
		iBoFOS.GET("/device/scan", func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.DeviceParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.ScanDevice(param)
			makeResponse(c, response, err)

		})
		iBoFOS.POST("/device/attach", func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.DeviceParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.AttachDevice(param)
			makeResponse(c, response, err)

		})
		iBoFOS.DELETE("/device/detach", func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.DeviceParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.DetachDevice(param)
			makeResponse(c, response, err)

		})
	}

	// Array
	{
		iBoFOS.GET("/array/device", func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.ArrayParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.ListArrayDevice(param)
			makeResponse(c, response, err)
		})
		iBoFOS.GET("/array", func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.ArrayParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.LoadArray(param)
			makeResponse(c, response, err)
		})
		iBoFOS.POST("/array", func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.ArrayParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.CreateArray(param)
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/array", func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.ArrayParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.DeleteArray(param)
			makeResponse(c, response, err)
		})
	}

	// Volume
	{
		iBoFOS.POST("/volume",  func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.VolumeParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.CreateVolume(param)
			makeResponse(c, response, err)
		})
		iBoFOS.GET("/volume",  func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.VolumeParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.ListVolume(param)
			makeResponse(c, response, err)
		})
		iBoFOS.PUT("/volume",  func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.VolumeParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.UpdateVolume(param)
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/volume",  func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.VolumeParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.DeleteVolume(param)
			makeResponse(c, response, err)
		})
		iBoFOS.POST("/volume/mount",  func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.VolumeParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.MountVolume(param)
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/volume/mount",  func(c *gin.Context) {
			request := model.Request{}
			c.ShouldBindBodyWith(&request, binding.JSON)
			b, _ := json.Marshal(request.Param)
			param := model.VolumeParam{}
			json.Unmarshal(b, &param)
			response, err := iBoFOSV1.UnmountVolume(param)
			makeResponse(c, response, err)
		})
	}
}

func makeResponse(c *gin.Context, response model.Response, err error) {

	if err == iBoFOSV1.ErrBadReq {
		api.MakeBadRequest(c, 12000)

	} else if err == iBoFOSV1.ErrSending {
		api.MakeResponse(c, 400, error.Error(err), 19002)

	} else if err == iBoFOSV1.ErrJson {
		api.MakeResponse(c, 400, error.Error(err), 12310)

	} else if err == iBoFOSV1.ErrRes {
		api.MakeBadRequest(c, response.Result.Status.Code)
	} else {
		api.MakeSuccessWithRes(c, response)
	}
}
