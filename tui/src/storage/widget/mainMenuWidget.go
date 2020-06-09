package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
	"os"
)

type mainMenuWidget struct {
	Widget *widgets.List
}

var MainMenu = mainMenuWidget{
	Widget: initMainMenu(),
}

func mainMenulist() []string {
	return []string{
		"(S)torage",
		"(M)onitoring",
		"(N)VMe Admin",
		"(Q)uit",
	}
}

func (mm *mainMenuWidget) Input(key string) {
	switch key {
	case "s", "S":
		mm.Storage()
	case "m", "M":
		mm.Monitoring()
	case "d", "D":
		mm.Debug()
	case "q", "Q", "<C-c>":
		termui.Close()
		os.Exit(0)
	}
}

func (mm *mainMenuWidget) Storage() {

}
func (mm *mainMenuWidget) Monitoring() {

}
func (mm *mainMenuWidget) Debug() {

}
func (mm *mainMenuWidget) Quit() {
	os.Exit(0)
}

func initMainMenu() *widgets.List {
	list := widgets.NewList()
	list.Title = "POS TUI"
	list.Rows = mainMenulist()
	list.SetRect(0, 0, 25, 6)
	list.TextStyle.Fg = termui.ColorYellow

	return list
}
