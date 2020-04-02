package mtool

import (
	exec "A-module/routers/mtool/api/exec"
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
	uri.Use(middleware.ReponseHeader)

	// D-Agent
	dagent := uri.Group("/dagent/v1")
	{
		dagent.GET("/ping", dagentV1.Ping)
		dagent.GET("/statuscode", dagentV1.StatusCode)
		dagent.POST("/ibofos", func(c *gin.Context) {
			cmd(c, exec.RunIBoF)
		})
		dagent.DELETE("/ibofos", func(c *gin.Context) {
			cmd(c, exec.ForceKillIbof)
		})
	}

	// iBoFOS
	iBoFOS := uri.Group("/ibofos/v1")

	// System
	{
		param := model.DeviceParam{}

		iBoFOS.GET("/system/heartbeat", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.Heartbeat, param)
		})
		iBoFOS.DELETE("/system/exitibofos", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.ExitiBoFOS, param)
		})
		iBoFOS.GET("/system", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.IBoFOSInfo, param)
		})
		iBoFOS.GET("/system/mount", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.MountiBoFOS, param)
		})
		iBoFOS.DELETE("/system/mount", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.UnmountiBoFOS, param)
		})
	}

	// Device
	{
		param := model.DeviceParam{}

		iBoFOS.GET("/device", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.ListDevice, param)
		})
		iBoFOS.GET("/device/scan", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.ScanDevice, param)
		})
		iBoFOS.POST("/device/attach", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.AttachDevice, param)
		})
		iBoFOS.DELETE("/device/detach", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.DetachDevice, param)
		})
	}

	// Array
	{
		param := model.ArrayParam{}

		iBoFOS.GET("/array/device", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.ListArrayDevice, param)
		})
		iBoFOS.GET("/array", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.LoadArray, param)
		})
		iBoFOS.POST("/array", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.CreateArray, param)
		})
		iBoFOS.DELETE("/array", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.DeleteArray, param)
		})
	}

	// Volume
	{
		param := model.VolumeParam{}

		iBoFOS.POST("/volume", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.CreateVolume, param)
		})
		iBoFOS.GET("/volume", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.ListVolume, param)
		})
		iBoFOS.PUT("/volume", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.UpdateVolume, param)
		})
		iBoFOS.DELETE("/volume", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.DeleteVolume, param)
		})
		iBoFOS.POST("/volume/mount", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.MountVolume, param)
		})
		iBoFOS.DELETE("/volume/mount", func(c *gin.Context) {
			callAmodule(c, iBoFOSV1.UnmountVolume, param)
		})
	}
}

func xrId(c *gin.Context) string {
	return c.GetHeader("X-request-Id")
}

func cmd(c *gin.Context, f func() (model.Response, error)) {
	res, err := f()
	api.HttpResponse(c, res, err)
}

func callAmodule(c *gin.Context, f func(string, interface{}) (model.Request, model.Response, error), param interface{}) {
	request := model.Request{}
	c.ShouldBindBodyWith(&request, binding.JSON)
	param = request.Param
	_, res, err := f(xrId(c), param)
	api.HttpResponse(c, res, err)
}
