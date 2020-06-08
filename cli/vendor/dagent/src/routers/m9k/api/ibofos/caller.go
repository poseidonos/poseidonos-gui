package ibofos

import (
	"a-module/routers/m9k/model"
	"dagent/src/routers/m9k/api"
	"dagent/src/routers/m9k/header"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func CalliBoFOS(ctx *gin.Context, f func(string, interface{}) (model.Request, model.Response, error)) {
	req := model.Request{}
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	_, res, err := f(header.XrId(ctx), req.Param)
	api.HttpResponse(ctx, res, err)
}

func CalliBoFOSwithParam(ctx *gin.Context, f func(string, interface{}) (model.Request, model.Response, error), pathValue interface{}) {
	req := model.Request{}
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	req.Param = pathValue
	_, res, err := f(header.XrId(ctx), req.Param)
	api.HttpResponse(ctx, res, err)
}
