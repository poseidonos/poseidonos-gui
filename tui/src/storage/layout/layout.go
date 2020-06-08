package layout

import (
	"github.com/gizak/termui/v3"
	"tui/src/storage/widget"
)

func Draw() {
	termui.Render(widget.MainMenu.Widget)
	termui.Render(widget.Command.Widget)
	termui.Render(widget.Result.Widget)
	termui.Render(widget.Plot.Widget)
	termui.Render(widget.Plot2.Widget)
	termui.Render(widget.Info.Widget)
}
