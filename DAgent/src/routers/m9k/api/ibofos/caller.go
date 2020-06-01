package ibofos

import (
	"A-module/routers/m9k/model"
	"DAgent/src/routers/m9k/api"
	"DAgent/src/routers/m9k/header"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func AmoduleLogic(ctx *gin.Context, f func(string, interface{}) (model.Request, model.Response, error), param interface{}) {
	req := model.Request{}
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	param = req.Param
	_, res, err := f(header.XrId(ctx), param)
	api.HttpResponse(ctx, res, err)
}
