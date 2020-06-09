package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type deviceWidget struct {
	Widget *widgets.Paragraph
}

var Device = deviceWidget{
	Widget: initDevice(),
}

func initDevice() *widgets.Paragraph {
	paragraph := widgets.NewParagraph()
	paragraph.Title = "Device"
	paragraph.Text = "No Device"
	paragraph.SetRect(25, 0, 50, 15)
	paragraph.TextStyle.Fg = termui.ColorWhite

	return paragraph
}
