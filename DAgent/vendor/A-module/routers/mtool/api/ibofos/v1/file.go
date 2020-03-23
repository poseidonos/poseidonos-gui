package v1

import (
	"A-module/routers/mtool/model"
)

func SendRequestJson(param model.Request) (model.Response, error) {
	return sendIBoF(param)
}
