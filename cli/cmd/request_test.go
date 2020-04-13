package cmd

import (
	_ "A-module/routers/mtool/model"
	"github.com/spf13/cobra"
	"testing"
)

func TestSend(t *testing.T) {

	tests := [][]string{
		[]string{"heartbeat"},
		[]string{"scan_dev"},
		[]string{"mount_ibofos"},
		[]string{"exit_ibofos"},
	}

	for _, tt := range tests {

		var cmd cobra.Command
		isQuiet = true

		t.Run(tt[0], func(t *testing.T) {
			res, err := Send(&cmd, tt)

			if err != nil || res.Result.Status.Code != 0 {
				t.Error("error")
			}
		})
	}
}
