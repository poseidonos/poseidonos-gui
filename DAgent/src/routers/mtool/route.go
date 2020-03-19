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

	// For Test
	{
		dagent.GET("/test/fio", func(c *gin.Context) {
			dagentV1.RunFio()
			//			makeResponse(c, response, err)
			//api.MakeSuccess(ctx)
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
			_, response, err := iBoFOSV1.Heartbeat(xrId(c))
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/system/exitibofos", func(c *gin.Context) {
			_, response, err := iBoFOSV1.ExitiBoFOS(xrId(c))
			makeResponse(c, response, err)
		})
		iBoFOS.GET("/system", func(c *gin.Context) {
			_, response, err := iBoFOSV1.IBoFOSInfo(c.GetHeader(xrId(c)))
			makeResponse(c, response, err)
		})
		iBoFOS.POST("/system/mount", func(c *gin.Context) {
			_, response, err := iBoFOSV1.MountiBoFOS(xrId(c))
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/system/mount", func(c *gin.Context) {
			_, response, err := iBoFOSV1.UnmountiBoFOS(xrId(c))
			makeResponse(c, response, err)
		})
	}

	// Device
	{
		iBoFOS.GET("/device", func(c *gin.Context) {
			param := deviceParam(c)
			_, response, err := iBoFOSV1.ListDevice(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.GET("/device/scan", func(c *gin.Context) {
			param := deviceParam(c)
			_, response, err := iBoFOSV1.ScanDevice(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.POST("/device/attach", func(c *gin.Context) {
			param := deviceParam(c)
			_, response, err := iBoFOSV1.AttachDevice(xrId(c), param)
			makeResponse(c, response, err)

		})
		iBoFOS.DELETE("/device/detach", func(c *gin.Context) {
			param := deviceParam(c)
			_, response, err := iBoFOSV1.DetachDevice(xrId(c), param)
			makeResponse(c, response, err)
		})
	}

	// Array
	{
		iBoFOS.GET("/array/device", func(c *gin.Context) {
			param := arrayParam(c)
			_, response, err := iBoFOSV1.ListArrayDevice(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.GET("/array", func(c *gin.Context) {
			param := arrayParam(c)
			_, response, err := iBoFOSV1.LoadArray(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.POST("/array", func(c *gin.Context) {
			param := arrayParam(c)
			_, response, err := iBoFOSV1.CreateArray(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/array", func(c *gin.Context) {
			param := arrayParam(c)
			_, response, err := iBoFOSV1.DeleteArray(xrId(c), param)
			makeResponse(c, response, err)
		})
	}

	// Volume
	{
		iBoFOS.POST("/volume", func(c *gin.Context) {
			param := volumeParam(c)
			_, response, err := iBoFOSV1.CreateVolume(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.GET("/volume", func(c *gin.Context) {
			param := volumeParam(c)
			_, response, err := iBoFOSV1.ListVolume(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.PUT("/volume", func(c *gin.Context) {
			param := volumeParam(c)
			_, response, err := iBoFOSV1.UpdateVolume(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/volume", func(c *gin.Context) {
			param := volumeParam(c)
			_, response, err := iBoFOSV1.DeleteVolume(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.POST("/volume/mount", func(c *gin.Context) {
			param := volumeParam(c)
			_, response, err := iBoFOSV1.MountVolume(xrId(c), param)
			makeResponse(c, response, err)
		})
		iBoFOS.DELETE("/volume/mount", func(c *gin.Context) {
			param := volumeParam(c)
			_, response, err := iBoFOSV1.UnmountVolume(xrId(c), param)
			makeResponse(c, response, err)
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

func deviceParam(c *gin.Context) model.DeviceParam {
	param := model.DeviceParam{}
	json.Unmarshal(requestParam(c), &param)
	return param
}

func arrayParam(c *gin.Context) model.ArrayParam {
	param := model.ArrayParam{}
	json.Unmarshal(requestParam(c), &param)
	return param
}

func volumeParam(c *gin.Context) model.VolumeParam {
	param := model.VolumeParam{}
	json.Unmarshal(requestParam(c), &param)
	return param
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
