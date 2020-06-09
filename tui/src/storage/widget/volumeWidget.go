package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type volumeWidget struct {
	Widget *widgets.Paragraph
}

var Volume = volumeWidget{
	Widget: initVolume(),
}

func initVolume() *widgets.Paragraph {
	paragraph := widgets.NewParagraph()
	paragraph.Title = "Volume"
	paragraph.Text = "No Volume"
	paragraph.SetRect(50, 0, 75, 15)
	paragraph.TextStyle.Fg = termui.ColorWhite

	return paragraph
}
