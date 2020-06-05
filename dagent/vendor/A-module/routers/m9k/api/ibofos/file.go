package ibofos

import (
	"A-module/routers/m9k/model"
)

func SendRequestJson(param model.Request) (model.Response, error) {
	return sendIBoF(param)
}
