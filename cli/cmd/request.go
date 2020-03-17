package cmd

import (
		"github.com/google/uuid"
		"github.com/spf13/cobra"
		"A-module/errors"
		"A-module/routers/mtool/model"
		iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	   )

var Buffer []string
var Data []string
var Spare []string
var Name string

var fttype int
var size int
var maxiops int
var maxbw int

var ArrayCommand = map[string]func(string, model.ArrayParam) (model.Response, error) {
	"list_array"   : iBoFOSV1.ListArrayDevice,
	"load_array"   : iBoFOSV1.LoadArray,
	"create_array" : iBoFOSV1.CreateArray,
	"delete_array" : iBoFOSV1.DeleteArray,
}

var DeviceCommand = map[string]func(string, model.DeviceParam) (model.Response, error) {
	"scan_dev" : iBoFOSV1.ScanDevice,
	"list_dev" : iBoFOSV1.ListDevice,
	"attach_dev" : iBoFOSV1.AttachDevice,
	"detach_dev" : iBoFOSV1.DetachDevice,
	"add_dev" : iBoFOSV1.AddDevice,
}

var SystemCommand = map[string]func(string) (model.Response, error) {
	"heartbeat" : iBoFOSV1.Heartbeat,
	"exit_ibofos" :iBoFOSV1.ExitiBoFOS,
	"info" :iBoFOSV1.IBoFOSInfo,
	"mount_ibofos" :iBoFOSV1.MountiBoFOS,
	"unmount_ibofos" :iBoFOSV1.UnmountiBoFOS,
}

var VolumeCommand = map[string]func(string, model.VolumeParam) (model.Response, error) {
	"create_vol" : iBoFOSV1.CreateVolume,
	"update_vol" : iBoFOSV1.UpdateVolume,
	"mount_vol" : iBoFOSV1.MountVolume,
	"unmount_vol" : iBoFOSV1.UnmountVolume,
	"delete_vol" : iBoFOSV1.DeleteVolume,
	"list_vol" : iBoFOSV1.ListVolume,
}

var commandCmd = &cobra.Command{
  Use:   "request [msg]",
  Short: "Request for msg to Poseidon OS",
  Long:  `Request for msg to Poseidon OS and get a response fommated by JSON.

Available msg list :

[Category] : [msg]
array      : list_array, load_array, create_array, delete_array
device     : scan_device, list_device, attach_device, detach_device, add_device
system     : heartbeat,exit_ibofos, info, mount_ibofos, unmount_ibofos
volume     : create_vol, update_vol, mount_vol, unmount_vol, delete_vol, list_vol


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
	Send(cmd, args[0])
  },
}

func init() {

	rootCmd.AddCommand(commandCmd)

	commandCmd.PersistentFlags().IntVarP(&fttype, "fttype", "f", 0, "set fttype \"-f 4194304\"")
	commandCmd.PersistentFlags().StringSliceVarP(&Buffer, "buffer", "b", []string{}, "set buffer name \"-b uram0\"")
	commandCmd.PersistentFlags().StringSliceVarP(&Data, "data", "d", []string{}, "set data name \"-d unvme-ns-0,unvme-ns-1,unvme-ns-2\"")
	commandCmd.PersistentFlags().StringSliceVarP(&Spare, "spare", "s", []string{}, "set spare name \"-p unvme-ns-3\"")
	commandCmd.PersistentFlags().StringVarP(&Name, "name", "n",  "", "set name \"-n vol01\"")
	commandCmd.PersistentFlags().IntVar(&size, "size", 0, "set size \"-s 4194304\"")
	commandCmd.PersistentFlags().IntVar(&maxiops, "maxiops", 0, "set maxiops \"--maxiops 4194304\"")
	commandCmd.PersistentFlags().IntVar(&maxbw, "maxbw", 0, "set maxbw \"--maxbw 4194304\"")
}

func Send(cmd *cobra.Command, command string) {

	if InitConnect() {

		var xrId string
		uuid, err := uuid.NewUUID()
		if err == nil {
			xrId = uuid.String()
		}
		
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

			//if cmd.PersistentFlags().Changed("fttype") {
				param.FtType = fttype
			//}
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
			ArrayCommand[command](xrId, param)
		} else if deviceExists {

			param := model.DeviceParam {}
			param.Name = Name
			if cmd.PersistentFlags().Changed("spare") {
				param.Spare = Spare[0]
			}
			DeviceCommand[command](xrId, param)

		} else if systemExists {

			SystemCommand[command](xrId)

		} else if volumeExists {

			param := model.VolumeParam {}
			param.Name = Name
			param.Size = size
			if cmd.PersistentFlags().Changed("maxiops") {
				param.Maxiops = maxiops
			}
			if cmd.PersistentFlags().Changed("maxbw") {
				param.Maxbw = maxbw
			}

			VolumeCommand[command](xrId, param)

		} else {
			//commands[command]()
		}
	} else {
		errors.New("Cannot connect to Poseidon OS !!!")
	}
}
