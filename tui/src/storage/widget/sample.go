package widget

import (
	termui "github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
	"math"
)

var sparklineData = []float64{4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6}
var barchartData = []float64{3, 2, 5, 3, 9, 5, 3, 2, 5, 8, 3, 2, 4, 5, 3, 2, 5, 7, 5, 3, 2, 6, 7, 4, 6, 3, 6, 7, 8, 3, 6, 4, 5, 3, 2, 4, 6, 4, 8, 5, 9, 4, 3, 6, 5, 3, 6}
var qq = []float64{3, 2, 5, 3, 9, 5, 3, 2, 5, 8, 3, 2, 4, 5, 3, 2, 5, 7, 5, 3, 2, 6, 7, 4, 6, 3, 6, 7, 8, 3, 6, 4, 5, 3, 2, 4, 6, 4, 8, 5, 9, 4, 3, 6, 5, 3, 6}

var SinData = (func() []float64 {
	n := 220
	ps := make([]float64, n)
	for i := range ps {
		ps[i] = 1 + math.Sin(float64(i)/5)
	}
	return ps
})()

func InitPlot1() *widgets.Plot {
	plot1 := widgets.NewPlot()
	plot1.Title = "Vol1 Bandwidth"
	plot1.Data = make([][]float64, 1)
	plot1.Data[0] = SinData
	plot1.SetRect(0, 15, 50, 25)
	plot1.AxesColor = termui.ColorWhite
	plot1.LineColors[0] = termui.ColorRed
	plot1.Marker = widgets.MarkerDot

	return plot1
}

func IinitPlot2() *widgets.Plot {
	plot2 := widgets.NewPlot()
	plot2.Title = "Vol1 IOPs"
	plot2.Data = make([][]float64, 1)
	plot2.Data[0] = SinData
	plot2.SetRect(50, 15, 75, 25)
	plot2.AxesColor = termui.ColorWhite
	plot2.LineColors[0] = termui.ColorYellow

	return plot2
}

/*
func initStatus() *widgets.Gauge {
	gauge := widgets.NewGauge()
	gauge.Title = "Status"
	gauge.Percent = 50
	gauge.SetRect(0, 12, 50, 15)
	gauge.BarColor = termui.ColorRed
	gauge.BorderStyle.Fg = termui.ColorWhite
	gauge.TitleStyle.Fg = termui.ColorCyan

	return gauge
}

func initBarChart() *widgets.BarChart {
	bc := widgets.NewBarChart()
	bc.Title = "PIDs"
	bc.SetRect(50, 0, 75, 15)
	bc.Labels = []string{"PID Info"}
	bc.BarColors[0] = termui.ColorGreen
	bc.NumStyles[0] = termui.NewStyle(termui.ColorBlack)

	return bc
}

func initSparklineGroup() *widgets.SparklineGroup {
	slg := widgets.NewSparklineGroup(sparkline1(), sparkline2())
	slg.Title = "CPU"
	slg.SetRect(25, 5, 50, 12)
	return slg
}

func sparkline1() *widgets.Sparkline {
	sl := widgets.NewSparkline()
	sl.Title = "CPU 0:"
	sl.Data = sparklineData
	sl.LineColor = termui.ColorCyan
	sl.TitleStyle.Fg = termui.ColorWhite

	return sl
}

func sparkline2() *widgets.Sparkline {
	sl2 := widgets.NewSparkline()
	sl2.Title = "CPU 1:"
	sl2.Data = sparklineData
	sl2.TitleStyle.Fg = termui.ColorWhite
	sl2.LineColor = termui.ColorRed

	return sl2
}
*/
