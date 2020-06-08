package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type command struct {
	list []string
}

func (cm command) Count() int {
	return len(cm.list)
}

var commandData = command{
	list: []string{
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

func InitCommand() *widgets.List {
	list := widgets.NewList()
	list.Title = "Command (J & K)"
	list.Rows = commandData.list
	list.SetRect(0, 6, 25, 15)
	list.TextStyle.Fg = termui.ColorYellow

	return list
}
