package main

import (
	"a-module/log"
	termui "github.com/gizak/termui/v3"
	"time"
	"tui/src/storage/layout"
)

var GitCommit string
var BuildTime string

var StorageLayout layout.StorageLayout

func main() {
	if err := termui.Init(); err != nil {
		log.Fatalf("failed to initialize termui: %v", err)
	}
	defer termui.Close()
	StorageLayout = layout.Layout()
	StorageLayout.Draw()
	waitInput()
}

func waitInput() {
	uiEvents := termui.PollEvents()
	ticker := time.NewTicker(time.Second).C

	tickerCount := 0
	tickerCount++

	for {
		select {
		case e := <-uiEvents:
			switch e.ID {
			case "k":
				tickerCount++
				//Layout.Command.Rows =  Layout.Command.Command[tickerCount%Layout.Command.Count():]
				StorageLayout.MainMenu.Title = "Press kkkkkk"
				StorageLayout.Draw()
			case "j":
				tickerCount--
				if tickerCount < 0 {
					tickerCount = 0
				}
				//Layout.Command.ListWidget.Rows =  Layout.Command.Command[tickerCount%Layout.Command.Count():]
				StorageLayout.MainMenu.Title = "Press jjj"
				StorageLayout.Draw()
			case "q", "<C-c>":
				return
			}
		case aaa := <-ticker:
			StorageLayout.Result.Text = "Ticker : " + aaa.String()
			StorageLayout.Draw()
		}
	}
}

//var sparklineData = []float64{4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6, 4, 2, 1, 6, 3, 9, 1, 4, 2, 15, 14, 9, 8, 6, 10, 13, 15, 12, 10, 5, 3, 6, 1, 7, 10, 10, 14, 13, 6}
//var barchartData = []float64{3, 2, 5, 3, 9, 5, 3, 2, 5, 8, 3, 2, 4, 5, 3, 2, 5, 7, 5, 3, 2, 6, 7, 4, 6, 3, 6, 7, 8, 3, 6, 4, 5, 3, 2, 4, 6, 4, 8, 5, 9, 4, 3, 6, 5, 3, 6}
//var qq = []float64{3, 2, 5, 3, 9, 5, 3, 2, 5, 8, 3, 2, 4, 5, 3, 2, 5, 7, 5, 3, 2, 6, 7, 4, 6, 3, 6, 7, 8, 3, 6, 4, 5, 3, 2, 4, 6, 4, 8, 5, 9, 4, 3, 6, 5, 3, 6}

//func draw(count int) {
//		//g.Percent = count % 101
//		//l.Rows = listData[count%9:]
//		//slg.Sparklines[0].initCommand = sparklineData[:30+count%50]
//		//slg.Sparklines[1].initCommand = sparklineData[:35+count%50]
//		//lc.initCommand[0] = test.SinData[count/2%220:]
//		//lc2.initCommand[0] = test.SinData[2*count%220:]
//		//bc.initCommand = barchartData[count/2%10:]
//
//		//for _, widget := range Layout. {
//		//	termui.Render(widget)
//		//}
//		v := reflect.ValueOf(Layout)
//		typeOfS := v.Type()
//
//		for i := 0; i < v.NumField(); i++ {
//			fmt.Printf("Field: %s\tValue: %v\n", typeOfS.Field(i).Name, v.Field(i).Interface())
//		}
//}

//func updateParagraph(count int) {
//	if count%2 == 0 {
//		//p.TextStyle.Fg = termui.ColorRed
//
//	} else {
//		//p.TextStyle.Fg = termui.ColorWhite
//	}
//}
