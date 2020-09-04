package ibofos

import (
	"a-module/src/routers/m9k/model"
)

func PerfImpact(xrId string, param interface{}) (model.Request, model.Response, error) {
	return Requester{xrId, param}.Post("REBUILDPERFIMPACT")
}
