package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type commandWidget struct {
	Widget *widgets.List
}

func (cm commandWidget) Count() int {
	return len(commandList())
}

var Command = commandWidget{
	Widget: initCommand(),
}

func commandList() []string {
	return []string{
		"[0] Scan Device",
		"[1] List Devices",
		"[2] S.M.A.R.T.",
		"[3] mount device",
		"[4] unmount device",
		"[5] list volumes",
		"[6] Blah~",
		"[7] Blah~ Blah~",
	}
}

func initCommand() *widgets.List {
	list := widgets.NewList()
	list.Title = "commandWidget (J & K)"
	list.Rows = commandList()
	list.SetRect(0, 6, 25, 15)
	list.TextStyle.Fg = termui.ColorYellow

	return list
}