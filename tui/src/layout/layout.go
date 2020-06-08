package layout

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
	"reflect"
)

type Layout struct {
	Paragraph1     *widgets.Paragraph
	Paragraph2     *widgets.Paragraph
	Paragraph3     *widgets.Paragraph
	List1          *widgets.List
	Guage1         *widgets.Gauge
	Sparklinegroup *widgets.SparklineGroup
	Plot1          *widgets.Plot
	Plot2          *widgets.Plot
	Barchart1      *widgets.BarChart
}

func (layout Layout) Draw() {
	v := reflect.ValueOf(layout)

	for i := 0; i < v.NumField(); i++ {
		termui.Render(v.Field(i).Interface().(termui.Drawable))
	}
}

func MainLayout() Layout {
	return Layout{
		Paragraph1:     Paragraph1(),
		Paragraph2:     Paragraph2(),
		Paragraph3:     Paragraph3(),
		List1:          List1(),
		Guage1:         Gauge1(),
		Sparklinegroup: SparklineGroup(),
		Plot1:          Plot1(),
		Plot2:          Plot2(),
		Barchart1:      BarChart1(),
	}
}
