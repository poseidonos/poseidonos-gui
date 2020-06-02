package main

import (
	"A-module/log"
	"math"
	"time"

	ui "github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

var GitCommit string
var BuildTime string

func init() {
	if err := ui.Init(); err != nil {
		log.Fatalf("failed to initialize termui: %v", err)
	}
	defer ui.Close()

	addWidget1()
	addWidget2()
	addWidget3()
}

func updateParagraph(count int) {
	if count%2 == 0 {
		//p.TextStyle.Fg = ui.ColorRed

	} else {
		//p.TextStyle.Fg = ui.ColorWhite
	}
}

var p = widgets.NewParagraph()
var l = widgets.NewList()
var g = widgets.NewGauge()
var sl = widgets.NewSparkline()
var lc2 = widgets.NewPlot()
var bc = widgets.NewBarChart()
var p2 = widgets.NewParagraph()
var p3 = widgets.NewParagraph()
var sl2 = widgets.NewSparkline()
var slg = widgets.NewSparklineGroup(sl, sl2)
var lc = widgets.NewPlot()
var sparklineData = []float64{4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6}
var barchartData = []float64{3, 2, 5, 3, 9, 5, 3, 2, 5, 8, 3, 2, 4, 5, 3, 2, 5, 7, 5, 3, 2, 6, 7, 4, 6, 3, 6, 7, 8, 3, 6, 4, 5, 3, 2, 4, 6, 4, 8, 5, 9, 4, 3, 6, 5, 3, 6}
var qq = []float64{3, 2, 5, 3, 9, 5, 3, 2, 5, 8, 3, 2, 4, 5, 3, 2, 5, 7, 5, 3, 2, 6, 7, 4, 6, 3, 6, 7, 8, 3, 6, 4, 5, 3, 2, 4, 6, 4, 8, 5, 9, 4, 3, 6, 5, 3, 6}

func addWidget(widget interface{}) {

}

func addWidget1() {
	p.Title = "iBoF Info"
	p.Text = "Vol1 : 20gb / No Limit\nVol2 : 20gb / No Limit"
	p.SetRect(0, 0, 50, 5)
	p.TextStyle.Fg = ui.ColorWhite
	p.BorderStyle.Fg = ui.ColorCyan
}
func addWidget2() {
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

	l.Title = "Command List"
	l.Rows = listData
	l.SetRect(0, 5, 25, 12)
	l.TextStyle.Fg = ui.ColorYellow

	g.Title = "Status"
	g.Percent = 50
	g.SetRect(0, 12, 50, 15)
	g.BarColor = ui.ColorRed
	g.BorderStyle.Fg = ui.ColorWhite
	g.TitleStyle.Fg = ui.ColorCyan

	sl.Title = "CPU 0:"
	sl.Data = sparklineData
	sl.LineColor = ui.ColorCyan
	sl.TitleStyle.Fg = ui.ColorWhite

	sl2.Title = "CPU 1:"
	sl2.Data = sparklineData
	sl2.TitleStyle.Fg = ui.ColorWhite
	sl2.LineColor = ui.ColorRed

	slg.Title = "CPU"
	slg.SetRect(25, 5, 50, 12)

	lc.Title = "Vol1 Bandwidth"
	lc.Data = make([][]float64, 1)
	lc.Data[0] = sinData
	lc.SetRect(0, 15, 50, 25)
	lc.AxesColor = ui.ColorWhite
	lc.LineColors[0] = ui.ColorRed
	lc.Marker = widgets.MarkerDot

}
func addWidget3() {
	bc.Title = "PIDs"
	bc.SetRect(50, 0, 75, 15)
	bc.Labels = []string{"PID Info"}
	bc.BarColors[0] = ui.ColorGreen
	bc.NumStyles[0] = ui.NewStyle(ui.ColorBlack)

	lc2.Title = "Vol1 IOPs"
	lc2.Data = make([][]float64, 1)
	lc2.Data[0] = sinData
	lc2.SetRect(50, 15, 75, 25)
	lc2.AxesColor = ui.ColorWhite
	lc2.LineColors[0] = ui.ColorYellow

	p2.Text = "Hey!\nI am a borderless block!"
	p2.Border = false
	p2.SetRect(50, 10, 75, 10)
	p2.TextStyle.Fg = ui.ColorMagenta

	p3.Title = "Help"
	p3.Text = "Q: Quit\nC: Change View\nVersion: " + GitCommit + "\nBuild Time: " + BuildTime
	p3.SetRect(0, 25, 75, 35)
	p3.TextStyle.Fg = ui.ColorWhite
	p3.BorderStyle.Fg = ui.ColorCyan

	tickerCount := 0
	draw(tickerCount)
	tickerCount++
	uiEvents := ui.PollEvents()

	ticker := time.NewTicker(time.Second).C
	for {
		select {
		case e := <-uiEvents:
			switch e.ID {
			case "k":
				tickerCount++
				draw(tickerCount)
			case "j":
				tickerCount--
				if tickerCount < 0 {
					tickerCount = 0
				}
				draw(tickerCount)
			case "q", "<C-c>":
				return
			}
		case <-ticker:
			updateParagraph(tickerCount)
			draw(tickerCount)
			tickerCount++
		}
	}
}

var sinData = (func() []float64 {
	n := 220
	ps := make([]float64, n)
	for i := range ps {
		ps[i] = 1 + math.Sin(float64(i)/5)
	}
	return ps
})()

func draw(count int) {
	g.Percent = count % 101
	//l.Rows = listData[count%9:]
	slg.Sparklines[0].Data = sparklineData[:30+count%50]
	slg.Sparklines[1].Data = sparklineData[:35+count%50]
	lc.Data[0] = sinData[count/2%220:]
	lc2.Data[0] = sinData[2*count%220:]
	bc.Data = barchartData[count/2%10:]
	//
	ui.Render(p, l, g, slg, lc, bc, lc2, p2, p3)
}

func main() {

}
