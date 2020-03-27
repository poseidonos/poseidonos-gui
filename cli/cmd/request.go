package cmd

import (
	"A-module/errors"
	"A-module/log"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/spf13/cobra"
)

var Buffer []string
var Data []string
var Spare []string
var Name string
var level string

var fttype int
var size int
var maxiops int
var maxbw int

var isJson bool

var ArrayCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"list_array":   iBoFOSV1.ListArrayDevice,
	"load_array":   iBoFOSV1.LoadArray,
	"create_array": iBoFOSV1.CreateArray,
	"delete_array": iBoFOSV1.DeleteArray,
}

var DeviceCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"scan_dev":   iBoFOSV1.ScanDevice,
	"list_dev":   iBoFOSV1.ListDevice,
	"attach_dev": iBoFOSV1.AttachDevice,
	"detach_dev": iBoFOSV1.DetachDevice,
}

var SystemCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"heartbeat":        iBoFOSV1.Heartbeat,
	"exit_ibofos":      iBoFOSV1.ExitiBoFOS,
	"info":             iBoFOSV1.IBoFOSInfo,
	"mount_ibofos":     iBoFOSV1.MountiBoFOS,
	"unmount_ibofos":   iBoFOSV1.UnmountiBoFOS,
	"stop_rebuilding":  iBoFOSV1.StopRebuilding,
	"set_log_level":    iBoFOSV1.SetLogLevel,
	"apply_log_filter": iBoFOSV1.ApplyLogFilter,
}

var VolumeCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"create_vol":  iBoFOSV1.CreateVolume,
	"update_vol":  iBoFOSV1.UpdateVolume,
	"mount_vol":   iBoFOSV1.MountVolume,
	"unmount_vol": iBoFOSV1.UnmountVolume,
	"delete_vol":  iBoFOSV1.DeleteVolume,
	"list_vol":    iBoFOSV1.ListVolume,
}

var commandCmd = &cobra.Command{
	Use:   "request [msg]",
	Short: "Request for msg to Poseidon OS",
	Long: `Request for msg to Poseidon OS and get a response fommated by JSON.

Available msg list :

[Category] : [msg]            : [example of flag]

array      : list_array       : not needed 
           : load_array       : not needed
           : create_array     : -b [buffer devs] -d [data devs] -s [spare devs] 
           : delete_array     : not needed

device     : scan_dev         : not needed 
           : list_dev         : not needed
           : attach_dev       : TBA 
           : detach_dev       : -n [dev name]
           : add_dev          : -s [spare devs]
          
system     : heartbeat        : not needed
           : exit_ibofos      : not needed
           : info             : not needed
           : mount_ibofos     : not needed
           : unmount_ibofos   : not needed
           : stop_rebuilding  : not needed
           : set_log_level"   : -l [log level]
           : apply_log_filter : not needed

volume     : create_vol       : -n [vol name] --size [vol size] --maxiops [max iops] --maxbw [max bw] 
                                maxiops, maxbw are optional and default value is 0.
           : update_vol       : TBA 
           : mount_vol        : -n [vol name]
           : unmount_vol      : -n [vol name]
           : delete_vol       : -n [vol name]
           : list_vol         : not needed

If you want to input multiple flag parameter, you have to seperate with ",". 
For example, "-d dev1,dev2,dev3". seperation by space is not allowed.


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
		_ = val1
		_ = val2
		_ = val3
		_ = val4

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
	commandCmd.PersistentFlags().StringVarP(&Name, "name", "n", "", "set name \"-n vol01\"")
	commandCmd.PersistentFlags().IntVar(&size, "size", 0, "set size \"-s 4194304\"")
	commandCmd.PersistentFlags().IntVar(&maxiops, "maxiops", 0, "set maxiops \"--maxiops 4194304\"")
	commandCmd.PersistentFlags().IntVar(&maxbw, "maxbw", 0, "set maxbw \"--maxbw 4194304\"")
	commandCmd.PersistentFlags().BoolVarP(&isJson, "json", "j", false, "print request and response fommated json")
	commandCmd.PersistentFlags().StringVarP(&level, "level", "l", "", "set level")
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
		_ = val1
		_ = val2
		_ = val3
		_ = val4

		if arrayExists {

			param := model.ArrayParam{}
			param.FtType = fttype
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

			req, res, err := ArrayCommand[command](xrId, param)

			if err != nil {
				log.Println(err)
			} else {
				PrintReqRes(req, res)
			}

		} else if deviceExists {

			param := model.DeviceParam{}
			param.Name = Name
			if cmd.PersistentFlags().Changed("spare") {
				param.Spare = Spare[0]
			}

			req, res, err := DeviceCommand[command](xrId, param)

			if err != nil {
				log.Println(err)
			} else {
				PrintReqRes(req, res)
			}

		} else if systemExists {

			var req model.Request
			var res model.Response
			var err error

			if cmd.PersistentFlags().Changed("level") {
				param := model.SystemParam{}
				param.Level = level
				req, res, err = SystemCommand[command](xrId, param)
			} else {
				req, res, err = SystemCommand[command](xrId, nil)
			}

			if err != nil {
				log.Println(err)
			} else {
				PrintReqRes(req, res)
			}

		} else if volumeExists {

			param := model.VolumeParam{}
			param.Name = Name
			param.Size = size
			if cmd.PersistentFlags().Changed("maxiops") {
				param.Maxiops = maxiops
			}
			if cmd.PersistentFlags().Changed("maxbw") {
				param.Maxbw = maxbw
			}

			req, res, err := VolumeCommand[command](xrId, param)

			if err != nil {
				log.Println(err)
			} else {
				PrintReqRes(req, res)
			}
		}
	} else {
		errors.New("Cannot connect to Poseidon OS !!!")
	}
}

func PrintReqRes(req model.Request, res model.Response) {

	if isJson {
		b, _ := json.Marshal(req)
		fmt.Println("{Request:", string(b), "}")
		b, _ = json.Marshal(res)
		fmt.Println("{Response:", string(b), "}")
	} else {
		b, _ := json.MarshalIndent(req.Param, "", "    ")

		fmt.Println("\n\nRequest to Poseidon OS")
		fmt.Println("    xrId        : ", req.Rid)
		fmt.Println("    Command     : ", req.Command)

		if string(b) != "null" {
			fmt.Println("    Param       :")
			fmt.Println(string(b))
		}

		fmt.Println("\n\nResponse from Poseidon OS")
		fmt.Println("    Code        : ", res.Result.Status.Code)
		fmt.Println("    Description : ", res.Result.Status.Description)

		b, _ = json.MarshalIndent(res.Result.Data, "", "    ")

		if string(b) != "null" {
			fmt.Println("    Data       : ", string(b))
		}

		fmt.Println("\n")
	}
}
