package mtool

import (
	dagentV1 "A-module/routers/mtool/api/dagent/v1"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"DAgent/src/routers/mtool/api"
	"DAgent/src/routers/mtool/middleware"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
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
		dagent.POST("/ibofos", func(c *gin.Context) {
			err := dagentV1.RunIBoF()
			if err == nil {
				//api.HttpResponse(c, nil, err)
			} else {
				//api.HttpResponse(c, nil, err)
				//api.MakeResponse(ctx, http.StatusBadRequest, description, 11000)
			}
		})
		dagent.DELETE("/ibofos", func(c *gin.Context) {
			//err := dagentV1.ForceKillIbof()
			//api.HttpResponse(c, nil, err)
		})
	}

	// iBoFOS
	iBoFOS := uri.Group("/ibofos/v1")
	iBoFOS.Use(middleware.CheckiBoFRun())

	// System
	{
		iBoFOS.GET("/system/heartbeat", func(c *gin.Context) {
			system(c, iBoFOSV1.Heartbeat)
		})
		iBoFOS.DELETE("/system/exitibofos", func(c *gin.Context) {
			system(c, iBoFOSV1.ExitiBoFOS)
		})
		iBoFOS.GET("/system", func(c *gin.Context) {
			system(c, iBoFOSV1.IBoFOSInfo)
		})
		iBoFOS.POST("/system/mount", func(c *gin.Context) {
			system(c, iBoFOSV1.MountiBoFOS)
		})
		iBoFOS.DELETE("/system/mount", func(c *gin.Context) {
			system(c, iBoFOSV1.UnmountiBoFOS)
		})
	}

	// Device
	{
		iBoFOS.GET("/device", func(c *gin.Context) {
			device(c, iBoFOSV1.ListDevice)
		})
		iBoFOS.GET("/device/scan", func(c *gin.Context) {
			device(c, iBoFOSV1.ScanDevice)
		})
		iBoFOS.POST("/device/attach", func(c *gin.Context) {
			device(c, iBoFOSV1.AttachDevice)
		})
		iBoFOS.DELETE("/device/detach", func(c *gin.Context) {
			device(c, iBoFOSV1.DetachDevice)
		})
	}

	// Array
	{
		iBoFOS.GET("/array/device", func(c *gin.Context) {
			array(c, iBoFOSV1.ListArrayDevice)
		})
		iBoFOS.GET("/array", func(c *gin.Context) {
			array(c, iBoFOSV1.LoadArray)
		})
		iBoFOS.POST("/array", func(c *gin.Context) {
			array(c, iBoFOSV1.CreateArray)
		})
		iBoFOS.DELETE("/array", func(c *gin.Context) {
			array(c, iBoFOSV1.DeleteArray)
		})
	}

	// Volume
	{
		iBoFOS.POST("/volume", func(c *gin.Context) {
			volume(c, iBoFOSV1.CreateVolume)
		})
		iBoFOS.GET("/volume", func(c *gin.Context) {
			volume(c, iBoFOSV1.ListVolume)
		})
		iBoFOS.PUT("/volume", func(c *gin.Context) {
			volume(c, iBoFOSV1.UpdateVolume)
		})
		iBoFOS.DELETE("/volume", func(c *gin.Context) {
			volume(c, iBoFOSV1.DeleteVolume)
		})
		iBoFOS.POST("/volume/mount", func(c *gin.Context) {
			volume(c, iBoFOSV1.MountVolume)
		})
		iBoFOS.DELETE("/volume/mount", func(c *gin.Context) {
			volume(c, iBoFOSV1.UnmountVolume)
		})
	}
}

func xrId(c *gin.Context) string {
	return c.GetHeader("X-request-Id")
}

func requestParam(c *gin.Context) []byte {
	request := model.Request{}
	c.ShouldBindBodyWith(&request, binding.JSON)
	requestParam, _ := json.Marshal(request.Param)
	return requestParam
}

func system(c *gin.Context, f func(string, model.SystemParam) (model.Request, model.Response, error)) {
	param := model.SystemParam{}
	json.Unmarshal(requestParam(c), &param)
	_, res, err := f(xrId(c), param)
	api.HttpResponse(c, res, err)
}

func device(c *gin.Context, f func(string, model.DeviceParam) (model.Request, model.Response, error)) {
	param := model.DeviceParam{}
	json.Unmarshal(requestParam(c), &param)
	_, res, err := f(xrId(c), param)
	api.HttpResponse(c, res, err)
}

func array(c *gin.Context, f func(string, model.ArrayParam) (model.Request, model.Response, error)) {
	param := model.ArrayParam{}
	json.Unmarshal(requestParam(c), &param)
	_, res, err := f(xrId(c), param)
	api.HttpResponse(c, res, err)
}

func volume(c *gin.Context, f func(string, model.VolumeParam) (model.Request, model.Response, error)) {
	param := model.VolumeParam{}
	json.Unmarshal(requestParam(c), &param)
	_, res, err := f(xrId(c), param)
	api.HttpResponse(c, res, err)
}
