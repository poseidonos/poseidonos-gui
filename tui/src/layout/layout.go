package layout

import (
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
	"reflect"
)

type Layout struct {
	Command        *widgets.List
	Paragraph1     *widgets.Paragraph
	Paragraph2     *widgets.Paragraph
	Paragraph3     *widgets.Paragraph
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
		Command:        initCommand(),
		Paragraph1:     initParagraph1(),
		Paragraph2:     initParagraph2(),
		Paragraph3:     initParagraph3(),
		Guage1:         initGauge(),
		Sparklinegroup: initSparklineGroup(),
		Plot1:          initPlot1(),
		Plot2:          iinitPlot2(),
		Barchart1:      initBarChart(),
	}
}
