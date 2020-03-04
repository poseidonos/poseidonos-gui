package cmd

import (
//		"fmt"
		"time"
		"github.com/spf13/cobra"
		"A-module/log"
		"A-module/errors"
		"A-module/handler"
		"A-module/setting"
		"A-module/routers/mtool/model"
		iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	   )

var Verbose bool
var Debug bool

var IP string
var Port string

var Buffer []string
var Data []string
var Spare []string
var Name string

var Size int

var ArrayCommand = map[string]func(model.ArrayParam) {
	"listarray"   : iBoFOSV1.ListArrayDevice,
	"loadarray"   : iBoFOSV1.LoadArray,
	"createarray" : iBoFOSV1.CreateArray,
	"deletearray" : iBoFOSV1.DeleteArray,
}

var DeviceCommand = map[string]func(model.DeviceParam) {
	"scandevice" : iBoFOSV1.ScanDevice,
	"listdevice" : iBoFOSV1.ListDevice,
	"attachdevice" : iBoFOSV1.AttachDevice,
	"detachdevice" : iBoFOSV1.DetachDevice,
}

var SystemCommand = map[string]func() {
	"heartbeat" : iBoFOSV1.Heartbeat,
	"exitibofos" :iBoFOSV1.ExitiBoFOS,
	"info" :iBoFOSV1.IBoFOSInfo,
	"mountibof" :iBoFOSV1.MountiBoFOS,
	"unmountibof" :iBoFOSV1.UnmountiBoFOS,
}

var VolumeCommand = map[string]func(model.VolumeParam) {
	"create" : iBoFOSV1.CreateVolume,
	"update" : iBoFOSV1.UpdateVolume,
	"mountvolume" : iBoFOSV1.MountVolume,
	"unmountvolume" : iBoFOSV1.UnmountVolume,
	"delete" : iBoFOSV1.DeleteVolume,
	"list" : iBoFOSV1.ListVolume,
}

var commandCmd = &cobra.Command{
  Use:   "command [msg]",
  Short: "Command to Poseidon OS",
  Long:  `Command to Poseidon OS and get a reply fommated by JSON.

Available msg list :

[Category] : [msg]
array      : listarray, loadarray, createarray, deletearray
device     : scandevice, listdevice, attachdevice, detachdevice
system     : heartbeat,exitibofos, info, mountibof, unmountibof
volume     : create, update, mountvolume, unmountvolume, delete, list


You can set ip and port number for connent to Poseidon OS using config.yaml or flags.
Default value is as below.

IP   : 127.0.0.1
Port : 18716


	  `,
  Args: func(cmd *cobra.Command, args []string) error {

	if len(args) != 1 {
      return errors.New("need an one msg !!!")
    }

	val1, arrayExists := ArrayCommand[args[0]]
	val2, deviceExists := DeviceCommand[args[0]]
	val3, systemExists := SystemCommand[args[0]]
	val4, volumeExists := VolumeCommand[args[0]]
	_ =  val1
	_ =  val2
	_ =  val3
	_ =  val4

	if !arrayExists && !deviceExists && !systemExists && !volumeExists {
		return errors.New("not available msg !!!")
	}

	return nil
  },

  Run: func(cmd *cobra.Command, args []string) {
	Send(args[0])
  },
}

func init() {

	rootCmd.AddCommand(commandCmd)
	commandCmd.PersistentFlags().BoolVarP(&Verbose, "verbose", "v", false, "verbose output")
	commandCmd.PersistentFlags().BoolVarP(&Debug, "debug", "d", false, "set a debug mode")
	
	commandCmd.PersistentFlags().StringVar(&IP, "ip", "", "set ip adddress like \"--ip 127.0.0.1\"")
	commandCmd.PersistentFlags().StringVar(&Port, "port", "", "set port number like \"--port 18716\"")

	commandCmd.PersistentFlags().StringSliceVarP(&Buffer, "buffer", "b", []string{}, "set buffer name \"-b uram0\"")
	commandCmd.PersistentFlags().StringSliceVarP(&Data, "data", "t", []string{}, "set data name \"-t unvme-ns-0,unvme-ns-1,unvme-ns-2\"")
	commandCmd.PersistentFlags().StringSliceVarP(&Spare, "spare", "p", []string{}, "set spare name \"-p unvme-ns-3\"")
	commandCmd.PersistentFlags().StringVarP(&Name, "name", "n",  "", "set name \"-n vol01\"")
	commandCmd.PersistentFlags().IntVarP(&Size, "size", "s", 0, "set size \"-s 4194304\"")

}

func Send(command string) {

	if Verbose == true {
		log.SetVerboseMode()
	} else if Debug == true {
		log.SetDebugMode()
	}

	setting.LoadConfig()

	if len(IP) != 0 {
		setting.Config.Server.IBoF.IP = IP
	}

	if len(Port) != 0 {
		setting.Config.Server.IBoF.Port = Port
	}

	log.Println("ip, port :", setting.Config.Server.IBoF.IP, setting.Config.Server.IBoF.Port)

	go handler.ConnectToIBoFOS()

	time.Sleep(time.Second*1)

	//if len(setting.Config.IBoFOSSocketAddr) > 0 {

		val1, arrayExists := ArrayCommand[command]
		val2, deviceExists := DeviceCommand[command]
		val3, systemExists := SystemCommand[command]
		val4, volumeExists := VolumeCommand[command]
		_ =  val1
		_ =  val2
		_ =  val3
		_ =  val4

		if arrayExists {

			param := model.ArrayParam {}
			param.FtType = 1

			for _, v := range Buffer {
				device := model.Device{}
				device.DeviceName = v
				param.Buffer = append(param.Buffer, device)
			}
			for _, v := range Data {
				device := model.Device{}
				device.DeviceName = v
				param.Data = append(param.Data, device)
			}
			for _, v := range Spare {
				device := model.Device{}
				device.DeviceName = v
				param.Spare = append(param.Spare, device)
			}
			ArrayCommand[command](param)
		} else if deviceExists {

			param := model.DeviceParam {}
			param.Name = Name
			DeviceCommand[command](param)

		} else if systemExists {

			SystemCommand[command]()

		} else if volumeExists {

			param := model.VolumeParam {}
			param.Name = Name
			param.Size = Size
			VolumeCommand[command](param)

		} else {
			//commands[command]()
		}
	//} else {
	//	fmt.Println("Cannot connect to Poseidon OS !!!")
	//}
}
