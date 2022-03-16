package pos

import (
  "github.com/poseidonos/pos-csi/pkg/util"
)


var nvmeTcpConfig = `
{
  "nodes": [
	{
	  "name": "localhost",
	  "rpcURL": "http://107.108.221.146:3000",
	  "targetType": "nvme-tcp",
  "targetAddr": "107.108.221.146:1158"
	}
  ]
}`

var stagingTargetPath = "/tmp"
var targetPath = "/tmp/test-pub4"

var utilConfig = util.Config{"test-driver", "test-version", "unix:///var/lib/kubelet/plugins/csi.pos.io/csi.sock", "test-nodeid", true, false}

var volumeInfo  = map[string]string {
                "transportType":      "tcp",
                "targetAddress":      "107.108.221.146",
                "transportServiceId":      "1158",
                "nqnName":             "nqn.2019-04.pos:subsystem-test-r-20",
                "arrayName":           "POSArray",
                "provisionerIP":   "107.108.221.146",
                "provisionerPort": "3000",
                "serialNumber":    "POS0000000003",
                "modelNumber":     "IBOF_VOLUME_EEEXTENSION",
                "maxNamespaces":   "256",
                "allowAnyHost":    "true",
                "bufCacheSize":    "64",
                "numSharedBuf":    "4096",
        }




//Changes not Required 

var volumeInfoWithoutTransportTypeTargetAddressTransportServiceId = map[string]string {
          "transportType":      "",
          "targetAddress":      "",
          "transportServiceId":      "",
          "nqnName":             volumeInfo["nqnName"] + "-2",
          "arrayName":           volumeInfo["arrayName"],
          "provisionerIP":       volumeInfo["provisionerIP"],
          "provisionerPort":     volumeInfo["provisionerPort"],
      }

var volumeInfoWithoutNqnNameArrayName = map[string]string {
  "transportType":      volumeInfo["transportType"],
  "targetAddress":      volumeInfo["targetAddress"],
  "transportServiceId":   volumeInfo["transportServiceId"],
  "nqnName":             "",
  "arrayName":           "",
  "provisionerIP":       volumeInfo["provisionerIP"],
  "provisionerPort":     volumeInfo["provisionerPort"],
}

var volumeInfoDiffSubsystem = map[string]string {
  "transportType":      volumeInfo["transportType"],
  "targetAddress":      volumeInfo["targetAddress"],
  "transportServiceId":   volumeInfo["transportServiceId"],
  "nqnName":             volumeInfo["nqnName"] + "-3",
  "arrayName":           volumeInfo["arrayName"],
  "provisionerIP":       volumeInfo["provisionerIP"],
  "provisionerPort":     volumeInfo["provisionerPort"],
}
