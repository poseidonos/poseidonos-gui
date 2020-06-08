package layout

import (
	termui "github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
	"math"
)

var sparklineData = []float64{4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6}
var barchartData = []float64{3, 2, 5, 3, 9, 5, 3, 2, 5, 8, 3, 2, 4, 5, 3, 2, 5, 7, 5, 3, 2, 6, 7, 4, 6, 3, 6, 7, 8, 3, 6, 4, 5, 3, 2, 4, 6, 4, 8, 5, 9, 4, 3, 6, 5, 3, 6}
var qq = []float64{3, 2, 5, 3, 9, 5, 3, 2, 5, 8, 3, 2, 4, 5, 3, 2, 5, 7, 5, 3, 2, 6, 7, 4, 6, 3, 6, 7, 8, 3, 6, 4, 5, 3, 2, 4, 6, 4, 8, 5, 9, 4, 3, 6, 5, 3, 6}

func Paragraph1() *widgets.Paragraph {
	p := widgets.NewParagraph()
	p.Title = "iBoF Info"
	p.Text = "Vol1 : 20gb / No Limit\nVol2 : 20gb / No Limit"
	p.SetRect(0, 0, 50, 5)
	p.TextStyle.Fg = termui.ColorWhite
	p.BorderStyle.Fg = termui.ColorCyan

	return p
}

func Paragraph2() *widgets.Paragraph {
	p2 := widgets.NewParagraph()
	p2.Text = "Hey!\nI am a borderless block!"
	p2.Border = false
	p2.SetRect(50, 10, 75, 10)
	p2.TextStyle.Fg = termui.ColorMagenta

	return p2
}

func Paragraph3() *widgets.Paragraph {
	p3 := widgets.NewParagraph()
	p3.Title = "Help"
	//p3.Text = "Q: Quit\nC: Change View\nVersion: " + GitCommit + "\nBuild Time: " + BuildTime
	p3.SetRect(0, 25, 75, 35)
	p3.TextStyle.Fg = termui.ColorWhite
	p3.BorderStyle.Fg = termui.ColorCyan

	return p3
}

func List1() *widgets.List {
	listData := []string{
		"[0] scan device",
		"[1] list devices",
		"[2] status info",
		"[3] mount device",
		"[4] unmount device",
		"[5] list volumes",
		"[6] Blah~",
		"[7] Blah~ Blah~",
	}

	l := widgets.NewList()
	l.Title = "Paragraph1 List"
	l.Rows = listData
	l.SetRect(0, 5, 25, 12)
	l.TextStyle.Fg = termui.ColorYellow

	return l
}

func Gauge1() *widgets.Gauge {
	g := widgets.NewGauge()
	g.Title = "Status"
	g.Percent = 50
	g.SetRect(0, 12, 50, 15)
	g.BarColor = termui.ColorRed
	g.BorderStyle.Fg = termui.ColorWhite
	g.TitleStyle.Fg = termui.ColorCyan

	return g
}

func SparklineGroup() *widgets.SparklineGroup {
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

var SinData = (func() []float64 {
	n := 220
	ps := make([]float64, n)
	for i := range ps {
		ps[i] = 1 + math.Sin(float64(i)/5)
	}
	return ps
})()

func Plot1() *widgets.Plot {
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

func Plot2() *widgets.Plot {
	plot2 := widgets.NewPlot()
	plot2.Title = "Vol1 IOPs"
	plot2.Data = make([][]float64, 1)
	plot2.Data[0] = SinData
	plot2.SetRect(50, 15, 75, 25)
	plot2.AxesColor = termui.ColorWhite
	plot2.LineColors[0] = termui.ColorYellow

	return plot2
}

func BarChart1() *widgets.BarChart {
	bc := widgets.NewBarChart()
	bc.Title = "PIDs"
	bc.SetRect(50, 0, 75, 15)
	bc.Labels = []string{"PID Info"}
	bc.BarColors[0] = termui.ColorGreen
	bc.NumStyles[0] = termui.NewStyle(termui.ColorBlack)

	return bc
}


