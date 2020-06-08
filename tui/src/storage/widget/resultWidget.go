package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type resultWidget struct {
	Widget *widgets.Paragraph
}

var Result = resultWidget{
	Widget: initResult(),
}

func initResult() *widgets.Paragraph {
	paragraph := widgets.NewParagraph()
	paragraph.Title = "result"
	paragraph.Text = "The result of latest request"
	paragraph.SetRect(25, 0, 75, 15)
	paragraph.TextStyle.Fg = termui.ColorWhite

	return paragraph
}
