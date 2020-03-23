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
		dagent.POST("/ibofos", dagentV1.RunIBoF)
		dagent.DELETE("/ibofos", func(c *gin.Context) {
			dagentV1.ForceKillIbof()
		})
	}

	// iBoFOS
	iBoFOS := uri.Group("/ibofos/v1")
	iBoFOS.Use(middleware.CheckiBoFRun())

	// For Test
	{
		iBoFOS.POST("/test/report", func(c *gin.Context) {
			iBoFOSV1.ReportTest(xrId(c))
		})
	}

	// System
	{
		iBoFOS.GET("/system/heartbeat", func(c *gin.Context) {
			system(c,iBoFOSV1.Heartbeat)
		})
		iBoFOS.DELETE("/system/exitibofos", func(c *gin.Context) {
			system(c,iBoFOSV1.ExitiBoFOS)
		})
		iBoFOS.GET("/system", func(c *gin.Context) {
			system(c,iBoFOSV1.IBoFOSInfo)
		})
		iBoFOS.POST("/system/mount", func(c *gin.Context) {
			system(c,iBoFOSV1.MountiBoFOS)
		})
		iBoFOS.DELETE("/system/mount", func(c *gin.Context) {
			system(c,iBoFOSV1.UnmountiBoFOS)
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

func system(c *gin.Context, f func(string) (model.Request, model.Response, error))  {
	_, response, err := f(xrId(c))
	makeResponse(c, response, err)
}

func device(c *gin.Context, f func(string, model.DeviceParam) (model.Request, model.Response, error))  {
	param := model.DeviceParam{}
	json.Unmarshal(requestParam(c), &param)
	_, response, err := f(xrId(c), param)
	makeResponse(c, response, err)
}

func array(c *gin.Context, f func(string, model.ArrayParam) (model.Request, model.Response, error))  {
	param := model.ArrayParam{}
	json.Unmarshal(requestParam(c), &param)
	_, response, err := f(xrId(c), param)
	makeResponse(c, response, err)
}

func volume(c *gin.Context, f func(string, model.VolumeParam) (model.Request, model.Response, error))  {
	param := model.VolumeParam{}
	json.Unmarshal(requestParam(c), &param)
	_, response, err := f(xrId(c), param)
	makeResponse(c, response, err)
}

func makeResponse(c *gin.Context, response model.Response, err error) {
	switch err {
	case iBoFOSV1.ErrBadReq:
		api.MakeBadRequest(c, 12000)
	case iBoFOSV1.ErrSending:
		api.MakeResponse(c, 400, error.Error(err), 19002)
	case iBoFOSV1.ErrJson:
		api.MakeResponse(c, 400, error.Error(err), 12310)
	case iBoFOSV1.ErrRes:
		api.MakeBadRequest(c, response.Result.Status.Code)
	default:
		api.MakeSuccessWithRes(c, response)
	}
}
