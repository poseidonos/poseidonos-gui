package widget

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

type plotWidget struct {
	Widget *widgets.Plot
}

var Plot = plotWidget{
	Widget: initPlot(),
}

func initPlot() *widgets.Plot {
	plot2 := widgets.NewPlot()
	plot2.Title = "Vol1 IOPs"
	plot2.Data = make([][]float64, 1)
	plot2.Data[0] = SinData
	plot2.SetRect(50, 15, 75, 25)
	plot2.AxesColor = termui.ColorWhite
	plot2.LineColors[0] = termui.ColorYellow

	return plot2
}