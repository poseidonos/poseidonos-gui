package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type plot2Widget struct {
	Widget *widgets.Plot
}

var Plot2 = plot2Widget{
	Widget: initPlot2(),
}

func initPlot2() *widgets.Plot {
	plot2 := widgets.NewPlot()
	plot2.Title = "Vol1 Bandwidth"
	plot2.Data = make([][]float64, 1)
	plot2.Data[0] = SinData
	plot2.SetRect(0, 15, 50, 25)
	plot2.AxesColor = termui.ColorWhite
	plot2.LineColors[0] = termui.ColorRed
	plot2.Marker = widgets.MarkerDot

	return plot2
}