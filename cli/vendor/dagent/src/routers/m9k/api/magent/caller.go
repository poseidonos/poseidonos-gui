package magent

import (
	"a-module/routers/m9k/model"
	"dagent/src/routers/m9k/api"
	"dagent/src/routers/m9k/header"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func CallMagent(ctx *gin.Context, f func(string, interface{}) (model.Response, error), param interface{}) {
	req := model.Request{}
	ctx.ShouldBindBodyWith(&req, binding.JSON)
	req.Param = param
	res, err := f(header.XrId(ctx), req.Param)
	api.HttpResponse(ctx, res, err)
}
