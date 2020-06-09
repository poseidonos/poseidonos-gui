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
	paragraph.Title = "S.M.A.R.T."
	paragraph.Text = "No Info"
	paragraph.SetRect(40, 0, 75, 15)
	paragraph.TextStyle.Fg = termui.ColorWhite

	return paragraph
}
