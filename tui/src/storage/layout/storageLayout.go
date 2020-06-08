package layout

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
	"reflect"
	"tui/src/storage/widget"
)

type StorageLayout struct {
	MainMenu *widgets.List
	Command  *widgets.List
	Result   *widgets.Paragraph
	Info     *widgets.Paragraph
	//Guage      *widgets.Gauge
	//Sparklinegroup *widgets.SparklineGroup
	Plot1 *widgets.Plot
	Plot2 *widgets.Plot
	//Barchart1      *widgets.BarChart
}

func (layout StorageLayout) Draw() {
	v := reflect.ValueOf(layout)

	for i := 0; i < v.NumField(); i++ {
		termui.Render(v.Field(i).Interface().(termui.Drawable))
	}
}

func Layout() StorageLayout {
	return StorageLayout{
		MainMenu: widget.InitMainMenu(),
		Command:  widget.InitCommand(),
		Result:   widget.InitResult(),
		Info:     widget.InitInfo(),
		//Guage:      InitStatus(),
		//Sparklinegroup: InitSparklineGroup(),
		Plot1: widget.InitPlot1(),
		Plot2: widget.IinitPlot2(),
		//Barchart1:      initBarChart(),
	}
}
