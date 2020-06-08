package layout

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type command struct {
	data []string
}

func (cm command) Count() int {
	return len(cm.data)
}

var commandData = command{
	data: []string{
		"[0] Scan Device",
		"[1] List Devices",
		"[2] S.M.A.R.T.",
		"[3] mount device",
		"[4] unmount device",
		"[5] list volumes",
		"[6] Blah~",
		"[7] Blah~ Blah~",
	},
}

func initCommand() *widgets.List {
	list := widgets.NewList()
	list.Title = "CommandWidget (J & K)"
	list.Rows = commandData.data
	list.SetRect(0, 5, 25, 12)
	list.TextStyle.Fg = termui.ColorYellow

	return list
}
