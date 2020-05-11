package mtool

import (
	"A-module/routers/mtool/api/exec"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"DAgent/src/routers/mtool/api"
	dagentV1 "DAgent/src/routers/mtool/api/dagent/v1"
	"DAgent/src/routers/mtool/middleware"
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
	uri.Use(middleware.ResponseHeader)

	// D-Agent
	dagent := uri.Group("/dagent/v1")
	{
		dagent.GET("/heartbeat", func(ctx *gin.Context) {
			dagentLogic(ctx, dagentV1.HeartBeat)
		})
		dagent.GET("/statuscode", dagentV1.StatusCode)
		//dagent.DELETE("/dagent", dagentV1.KillDAgent)
		dagent.DELETE("/dagent", func(ctx *gin.Context) {
			dagentLogic(ctx, dagentV1.KillDAgent)
		})
		dagent.DELETE("/ibofos", func(ctx *gin.Context) {
			dagentLogic(ctx, exec.ForceKillIbof)
		})
	}

	// iBoFOS
	iBoFOS := uri.Group("/ibofos/v1")
	iBoFOS.Use(middleware.PostHandler)

	// System
	{
		param := model.DeviceParam{}

		iBoFOS.POST("/system/ibofos", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.RuniBoFOS, param)
		})
		iBoFOS.DELETE("/system/ibofos", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.ExitiBoFOS, param)
		})
		iBoFOS.GET("/system", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.IBoFOSInfo, param)
		})
		iBoFOS.POST("/system/mount", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.MountiBoFOS, param)
		})
		iBoFOS.DELETE("/system/mount", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.UnmountiBoFOS, param)
		})
		iBoFOS.DELETE("/system/disk/", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.DetachDevice, param)
		})
	}

	// Device
	{
		param := model.DeviceParam{}

		iBoFOS.GET("/device", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.ListDevice, param)
		})
		iBoFOS.GET("/device/scan", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.ScanDevice, param)
		})
		iBoFOS.POST("/device", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.AddDevice, param)
		})
		iBoFOS.DELETE("/device", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.RemoveDevice, param)
		})
	}

	// Array
	{
		param := model.ArrayParam{}

		iBoFOS.GET("/array/device", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.ListArrayDevice, param)
		})
		iBoFOS.GET("/array", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.LoadArray, param)
		})
		iBoFOS.POST("/array", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.CreateArray, param)
		})
		iBoFOS.DELETE("/array", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.DeleteArray, param)
		})
	}

	// Volume
	{
		param := model.VolumeParam{}

		iBoFOS.POST("/volume", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.CreateVolume, param)
		})
		iBoFOS.GET("/volume", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.ListVolume, param)
		})
		iBoFOS.PUT("/volume", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.UpdateVolume, param)
		})
		iBoFOS.DELETE("/volume", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.DeleteVolume, param)
		})
		iBoFOS.POST("/volume/mount", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.MountVolume, param)
		})
		iBoFOS.DELETE("/volume/mount", func(ctx *gin.Context) {
			amoduleLogic(ctx, iBoFOSV1.UnmountVolume, param)
		})
	}
}

func xrId(c *gin.Context) string {
	return c.GetHeader("X-request-Id")
}

func dagentLogic(ctx *gin.Context, f func(string) (model.Response, error)) {
	req := model.Request{}
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	res, err := f(xrId(ctx))
	api.HttpResponse(ctx, res, err)
}

func amoduleLogic(ctx *gin.Context, f func(string, interface{}) (model.Request, model.Response, error), param interface{}) {
	req := model.Request{}
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	param = req.Param
	_, res, err := f(xrId(ctx), param)
	api.HttpResponse(ctx, res, err)
}
