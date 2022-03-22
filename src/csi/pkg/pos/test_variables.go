package pos

import (
  "github.com/poseidonos/pos-csi/pkg/util"
)


var nvmeTcpConfig = `
{
  "nodes": [
	{
	  "name": "localhost",
	  "rpcURL": "http://107.108.83.97:3000",
	  "targetType": "nvme-tcp",
  "targetAddr": "107.108.83.97:1158"
	}
  ]
}`

var volumeInfo  = map[string]string {
                "transportType":      "tcp",
                "targetAddress":      "107.108.83.97",
                "transportServiceId":      "1158",
                "nqnName":             "nqn.2019-04.pos:subsystem-test-r-20",
                "arrayName":           "POSArray",
                "provisionerIP":   "107.108.83.97",
                "provisionerPort": "3000",
                "serialNumber":    "POS0000000003",
                "modelNumber":     "IBOF_VOLUME_EEEXTENSION",
                "maxNamespaces":   "256",
                "allowAnyHost":    "true",
                "bufCacheSize":    "64",
                "numSharedBuf":    "4096",
        }

const infiniteVolumeSize = 204800 * 204800 * 204800
const idempotencyCount = 10
const concurrencyCount = 1  //As It fails sometimes if count > 1

const nodeVolumeName = "new-voll-4"

var stagingTargetPath = "/tmp"
var targetPath = "/tmp/test-pub6"
var wrongStagingTargetPath = "/wrong-path/ddd" //make sure this path doesnot exist

var utilConfig = util.Config{"test-driver", "test-version", "unix:///var/lib/kubelet/plugins/csi.pos.io/csi.sock", "test-nodeid", true, false}
