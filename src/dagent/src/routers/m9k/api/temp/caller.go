package temp

import (
	"pnconnector/src/routers/m9k/model"
        "dagent/src/routers/m9k/api"
        "github.com/gin-gonic/gin"
        "github.com/gin-gonic/gin/binding"
	"os/exec"
	"log"
	"fmt"
	"encoding/json"
)

func CallTemp(ctx *gin.Context) {
        req := model.Request{}
        ctx.ShouldBindBodyWith(&req, binding.JSON)
	out, err := exec.Command("/root/workspace/ibofos/lib/spdk/scripts/rpc.py", "nvmf_get_subsystems").Output()
        if err != nil {
                log.Fatal(err)
        }
        strMap := []interface{}{}
        json.Unmarshal(out, &strMap)
        str := fmt.Sprintf("%s", out)
        log.Print(str)
        namespaces := strMap[1].(map[string]interface{})["namespaces"].([]interface{})
	res := model.Response{}

	if len(namespaces) > 1 {
		res.Result.Data = namespaces[len(namespaces) - 1]
	}
        api.HttpResponse(ctx, res, err)
}

