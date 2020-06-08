package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

var GitCommit string
var BuildTime string

func InitInfo() *widgets.Paragraph {
	p := widgets.NewParagraph()
	p.Title = "Info"
	p.Text = "GitCommit: " + GitCommit + "\nBuildTime: " + BuildTime
	p.SetRect(0, 25, 75, 30)
	p.TextStyle.Fg = termui.ColorWhite
	p.BorderStyle.Fg = termui.ColorCyan

	return p
}
