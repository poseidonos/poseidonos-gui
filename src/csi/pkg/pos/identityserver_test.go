package pos

import (
	"context"
	"testing"

	"github.com/container-storage-interface/spec/lib/go/csi"

	csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
)


func TestNewIdentityServer( t *testing.T ){
	cd := csicommon.NewCSIDriver("test-driver", "test-version", "test-node")
	is := newIdentityServer(cd)
	req := csi.GetPluginCapabilitiesRequest{}
	_, err := is.GetPluginCapabilities(context.TODO(), &req)
	if err != nil {
		t.Fatal(err)
	}
}
