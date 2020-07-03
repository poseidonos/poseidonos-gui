package main

import (
	"a-module/log"
	termui "github.com/gizak/termui/v3"
	"tui/src/storage/layout"
	"tui/src/storage/widget"
)

func main() {
	if err := termui.Init(); err != nil {
		log.Fatalf("failed to initialize termui: %v", err)
	}
	defer termui.Close()
	layout.Draw()
	waitInput()
}

func waitInput() {
	uiEvents := termui.PollEvents()
	//ticker := time.NewTicker(time.Second).C

	for {
		select {
		case e := <-uiEvents:
			switch e.ID {
			case "s", "S", "m", "M", "d", "D", "q", "Q", "<C-c>":
				widget.MainMenu.Input(e.ID)
			case "j", "J", "k", "K", "<Enter>":
				widget.Command.Input(e.ID)
			}
			layout.Draw()
			//case aaa := <-ticker:
			//log.Info(aaa)
			//StorageLayout.result.Text = "Ticker : " + aaa.String()
			//StorageLayout.Draw()
		}
	}
}
