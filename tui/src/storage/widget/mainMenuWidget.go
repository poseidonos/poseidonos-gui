package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type mainMenu struct {
	list []string
}

var mainMenuData = mainMenu{
	list: []string{
		"(S)torage",
		"(M)onitoring",
		"(D)ebug.",
		"(Q)uit",
	},
}

func InitMainMenu() *widgets.List {
	list := widgets.NewList()
	list.Title = "POS TUI"
	list.Rows = mainMenuData.list
	list.SetRect(0, 0, 25, 6)
	list.TextStyle.Fg = termui.ColorYellow

	return list
}
