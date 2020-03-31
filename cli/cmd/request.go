package cmd

import (
	"A-module/errors"
	"A-module/log"
	iBoFOSV1 "A-module/routers/mtool/api/ibofos/v1"
	"A-module/routers/mtool/model"
	"A-module/setting"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/spf13/cobra"
)

var buffer []string
var data []string
var spare []string
var name string
var newName string
var level string

var fttype int
var size int
var maxiops int
var maxbw int

var ArrayCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"create_array": iBoFOSV1.CreateArray,
	"delete_array": iBoFOSV1.DeleteArray,
	"list_array":   iBoFOSV1.ListArrayDevice,
	"load_array":   iBoFOSV1.LoadArray,
}

var DeviceCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"scan_dev":         iBoFOSV1.ScanDevice,
	"list_dev":         iBoFOSV1.ListDevice,
	"attach_dev":       iBoFOSV1.AttachDevice,
	"detach_dev":       iBoFOSV1.DetachDevice,
	"add_dev":          iBoFOSV1.AddDevice,
	"remove_dev":       iBoFOSV1.RemoveDevice,
	"start_monitoring": iBoFOSV1.StartDeviceMonitoring,
	"stop_monitoring":  iBoFOSV1.StopDeviceMonitoring,
	"monitoring_state": iBoFOSV1.DeviceMonitoringState,
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
	"create_vol": iBoFOSV1.CreateVolume,
	//	"update_vol":  iBoFOSV1.UpdateVolume,
	"mount_vol":      iBoFOSV1.MountVolume,
	"unmount_vol":    iBoFOSV1.UnmountVolume,
	"delete_vol":     iBoFOSV1.DeleteVolume,
	"list_vol":       iBoFOSV1.ListVolume,
	"update_vol_qos": iBoFOSV1.UpdateVolumeQoS,
	"rename_vol":     iBoFOSV1.RenameVolume,
	"resize_vol":     iBoFOSV1.ResizeVolume,
}

var commandCmd = &cobra.Command{
	Use:   "request [msg]",
	Short: "Request for msg to Poseidon OS",
	Long: `Request for msg to Poseidon OS and get a response fommated by JSON.

Available msg list :

[Category] : [msg]            : [example of flag]

array      : create_array     : -b [buffer devs] -d [data devs] -s [spare devs] 
           : delete_array     : not needed
           : list_array       : not needed 
           : load_array       : not needed

device     : scan_dev         : not needed 
           : list_dev         : not needed
           : attach_dev       : TBA 
           : detach_dev       : -n [dev name]
           : add_dev          : -s [spare devs]
           : remove_dev       : -n [dev name]
           : start_monitoring : not needed
           : stop_monitoring  : not needed
           : monitoring_state : not needed

system     : heartbeat        : not needed
           : exit_ibofos      : not needed
           : info             : not needed
           : mount_ibofos     : not needed
           : unmount_ibofos   : not needed
           : stop_rebuilding  : not needed
           : set_log_level"   : --level [log level]
           : apply_log_filter : not needed

volume     : create_vol       : --name [vol name] --size [vol size] --maxiops [max iops] --maxbw [max bw] 
                                maxiops, maxbw are optional and default value is 0.
           : mount_vol        : --name [vol name]
           : unmount_vol      : --name [vol name]
           : delete_vol       : --name [vol name]
           : list_vol         : not needed
		   : update_vol_qos   : --name [vol name] --maxiops [max iops] --maxbw [max bw] 
           : rename_vol       : --name [vol name] --newname [new vol name]
           : resize_vol       : --name [vol name] --size [vol size] 



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
	commandCmd.PersistentFlags().StringSliceVarP(&buffer, "buffer", "b", []string{}, "set buffer name \"-b uram0\"")
	commandCmd.PersistentFlags().StringSliceVarP(&data, "data", "d", []string{}, "set data name \"-d unvme-ns-0,unvme-ns-1,unvme-ns-2\"")
	commandCmd.PersistentFlags().StringSliceVarP(&spare, "spare", "s", []string{}, "set spare name \"-p unvme-ns-3\"")
	commandCmd.PersistentFlags().StringVarP(&name, "name", "n", "", "set name \"-n vol01\"")
	commandCmd.PersistentFlags().StringVar(&newName, "newname", "", "set new name \"--newname vol01\"")
	commandCmd.PersistentFlags().IntVar(&size, "size", 0, "set size \"-s 4194304\"")
	commandCmd.PersistentFlags().IntVar(&maxiops, "maxiops", 0, "set maxiops \"--maxiops 4194304\"")
	commandCmd.PersistentFlags().IntVar(&maxbw, "maxbw", 0, "set maxbw \"--maxbw 4194304\"")
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
			for _, v := range buffer {
				device := model.Device{}
				device.DeviceName = v
				param.Buffer = append(param.Buffer, device)
			}
			for _, v := range data {
				device := model.Device{}
				device.DeviceName = v
				param.Data = append(param.Data, device)
			}
			for _, v := range spare {
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
			param.Name = name
			if cmd.PersistentFlags().Changed("spare") {
				param.Spare = spare[0]
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
			param.Name = name
			param.Size = size
			if cmd.PersistentFlags().Changed("maxiops") {
				param.Maxiops = maxiops
			}
			if cmd.PersistentFlags().Changed("maxbw") {
				param.Maxbw = maxbw
			}
			if cmd.PersistentFlags().Changed("newname") {
				param.NewName = newName
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
		fmt.Println("    Code        : ", setting.GetStatusDesc(res.Result.Status.Code))
		fmt.Println("    Description : ", res.Result.Status.Description)

		b, _ = json.MarshalIndent(res.Result.Data, "", "    ")

		if string(b) != "null" {
			fmt.Println("    Data       : ", string(b))
		}

		fmt.Println("\n")
	}
}
