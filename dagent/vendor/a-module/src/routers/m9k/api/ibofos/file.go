package ibofos

import (
	"a-module/src/routers/m9k/model"
)

func SendRequestJson(param model.Request) (model.Response, error) {
	return sendIBoF(param)
}
