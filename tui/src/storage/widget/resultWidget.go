package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

func InitResult() *widgets.Paragraph {
	paragraph := widgets.NewParagraph()
	paragraph.Title = "Result"
	paragraph.Text = "The Result of latest request"
	paragraph.SetRect(25, 0, 75, 15)
	paragraph.TextStyle.Fg = termui.ColorWhite

	return paragraph
}
