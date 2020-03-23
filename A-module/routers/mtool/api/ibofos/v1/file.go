package v1

import (
	"A-module/routers/mtool/model"
)

func SendRequestJson(param model.Request) (int, error) {
	return sendIBoF(param)
}
