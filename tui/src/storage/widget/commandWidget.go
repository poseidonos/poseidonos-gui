package widget

import (
	iBoFOS "a-module/routers/m9k/api/ibofos"
	"fmt"
	"github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
	"github.com/google/uuid"
)

type commandWidget struct {
	Widget   *widgets.List
	List     []string
	Position int
}

func (cm *commandWidget) Input(key string) int {
	switch key {
	case "j", "J":
		cm.Position++
	case "k", "K":
		cm.Position--
		if cm.Position < 0 {
			cm.Position = 0
		}
	case "<Enter>":
		excuteCommand(cm.Position)
	}
	cm.Widget.Rows = cm.List[cm.Position%len(commandList):]
	return cm.Position
}

func excuteCommand(position int) {
	newUUID, _ := uuid.NewUUID()
	xrId := newUUID.String()

	switch position {
	case 0:
		iBoFRequest, res, err := iBoFOS.RuniBoFOS(xrId, nil)

		temp1 := fmt.Sprintf("iBoFRequest : %+v", iBoFRequest)
		temp2 := fmt.Sprintf("res : %+v", res)
		temp3 := fmt.Sprintf("err : %+v", err)

		Info.Widget.Text = temp2

	case 1:
		iBoFOS.ExitiBoFOS(xrId, nil)
	case 2:
		iBoFOS.ScanDevice(xrId, nil)

	}
}

var Command = commandWidget{
	Widget:   initCommand(),
	List:     commandList,
	Position: 0,
}

var commandList = []string{
	"[0] Run POS",
	"[1] Exit POS",
	"[2] Scan Device",
	"[3] List Device",
	"[4] Create Array",
	"[5] Load Array",
	"[6] Delete Array",
	"[7] State Array",
	"[8] Mount POS",
	"[9] Unmount POS",
}

func initCommand() *widgets.List {
	list := widgets.NewList()
	list.Title = "Command (J & K)"
	list.Rows = commandList
	list.SetRect(0, 6, 25, 15)
	list.TextStyle.Fg = termui.ColorYellow

	return list
}
