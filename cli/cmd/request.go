package cmd

import (
	"a-module/src/errors"
	iBoFOS "a-module/src/routers/m9k/api/ibofos"
	"a-module/src/routers/m9k/model"
	"a-module/src/util"
	"a-module/src/log"
	"encoding/json"
	"fmt"
	"github.com/c2h5oh/datasize"
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
var size string
var maxiops uint64
var maxbw uint64

var ArrayCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"create_array":      iBoFOS.CreateArray,
	"delete_array":      iBoFOS.DeleteArray,
	"list_array_device": iBoFOS.ListArrayDevice,
	"load_array":        iBoFOS.LoadArray,
	"array_info":        iBoFOS.ArrayInfo,
}

var DeviceCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"scan_dev":         iBoFOS.ScanDevice,
	"list_dev":         iBoFOS.ListDevice,
	"add_dev":          iBoFOS.AddDevice,
	"remove_dev":       iBoFOS.RemoveDevice,
	"start_monitoring": iBoFOS.StartDeviceMonitoring,
	"stop_monitoring":  iBoFOS.StopDeviceMonitoring,
	"monitoring_state": iBoFOS.DeviceMonitoringState,
	"detach_dev":       iBoFOS.DetachDevice,
	"smart":            iBoFOS.GetSMART,
}

var SystemCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"exit_ibofos":      iBoFOS.ExitiBoFOS,
	"run_ibofos":       iBoFOS.RuniBoFOS,
	"info":             iBoFOS.IBoFOSInfo,
	"mount_ibofos":     iBoFOS.MountiBoFOS,
	"unmount_ibofos":   iBoFOS.UnmountiBoFOS,
	"stop_rebuilding":  iBoFOS.StopRebuilding,
	"set_log_level":    iBoFOS.SetLogLevel,
	"get_log_level":    iBoFOS.GetLogLevel,
	"apply_log_filter": iBoFOS.ApplyLogFilter,
	//"wbt":              iBoFOS.WBT,
	//"list_wbt":         iBoFOS.ListWBT,
	//"do_gc":            iBoFOS.DoGC,
}

var VolumeCommand = map[string]func(string, interface{}) (model.Request, model.Response, error){
	"create_vol": iBoFOS.CreateVolume,
	//	"update_vol":  iBoFOS.UpdateVolume,
	"mount_vol":      iBoFOS.MountVolume,
	"unmount_vol":    iBoFOS.UnmountVolume,
	"delete_vol":     iBoFOS.DeleteVolume,
	"list_vol":       iBoFOS.ListVolume,
	"update_vol_qos": iBoFOS.UpdateVolumeQoS,
	"rename_vol":     iBoFOS.RenameVolume,
	//"resize_vol":     iBoFOS.ResizeVolume,
	"get_max_vol_cnt": iBoFOS.GetMaxVolumeCount,
}

var commandCmd = &cobra.Command{
	Use:   "request [msg]",
	Short: "Request for msg to Poseidon OS",
	Long: `Request for msg to Poseidon OS and get a response fommated by JSON.

Available msg list :

[Category] : [msg]            : [description]                                                    : [example of flag]

array      : create_array     : Provides device configuration information for configuring array. : -b [buffer devs] -d [data devs] -s [spare devs] 
           : delete_array     : Delete array.                                                    : not needed
           : list_array_device: Show all devices in the Array.                                   : not needed
           : load_array       : Load device configuration from mbr data.                         : not needed
           : array_info       : Show Information about Array.                                    : not needed

device     : scan_dev         : Scan devices in the system.                                      : not needed
           : list_dev         : Show all devices in the system.                                  : not needed
           : add_dev          : Add spare device to the Array.                                   : -s [spare devs]
           : remove_dev       : Remove spare device from the Array.                              : -n [dev name]
           : smart            : Get SMART from NVMe device.                                      : -n [dev name]

system     : run_ibofos       : Run iBoFOS.                                                      : not needed
           : exit_ibofos      : Exit iBoFOS.                                                     : not needed
           : info             : Show current state of IbofOS.                                    : not needed
           : mount_ibofos     : Mount iBoFOS.                                                    : not needed
           : unmount_ibofos   : Unmount iBoFOS.                                                  : not needed
           : set_log_level"   : Set filtering level to logger.                                   : --level [log level]
           : get_log_level"   : Get filtering level to logger.                                   : not needed
           : apply_log_filter : Apply filtering policy to logger.                                : not needed

volume     : create_vol       : Create a new volume in unit of bytes.                            : --name [vol name] --size [vol size] --maxiops [max iops] --maxbw [max bw] (maxiops, maxbw are optional and default value is 0.)
           : mount_vol        : Mount a volume.                                                  : --name [vol name]
           : unmount_vol      : Unmount a volume.                                                : --name [vol name]
           : delete_vol       : Delete a volume.                                                 : --name [vol name]
           : list_vol         : Listing all volumes.                                             : not needed
           : update_vol_qos   : Update volumes QoS properties.                                   : --name [vol name] --maxiops [max iops] --maxbw [max bw] 
           : rename_vol       : Update volume name.                                              : --name [vol name] --newname [new vol name]
           : get_max_vol_cnt  : Get max volume count.                                            : not needed

internal   : detach_dev       : Detach device from the system.                                   : -n [dev name]
           : start_monitoring : Start monitoring daemon manually.                                : not needed
           : stop_monitoring  : Stop monitoring daemon manually.                                 : not needed
           : monitoring_state : Get monitoring state.                                            : not needed
           : stop_rebuilding  : Stop rebuilding.                                                 : not needed


If you want to input multiple flag parameter, you have to seperate with ",". 
For example, "-d dev1,dev2,dev3". seperation by space is not allowed.


You can set ip and port number for connect to Poseidon OS using config.yaml or flags.
Default value is as below.

IP   : 127.0.0.1
Port : 18716


	  `,
	Args: func(cmd *cobra.Command, args []string) error {

		if len(args) != 1 {
			return errors.New("need an one msg !!!")
		}

		_, arrayExists := ArrayCommand[args[0]]
		_, deviceExists := DeviceCommand[args[0]]
		_, systemExists := SystemCommand[args[0]]
		_, volumeExists := VolumeCommand[args[0]]

		if !arrayExists && !deviceExists && !systemExists && !volumeExists {
			return errors.New("not available msg !!!")
		}

		return nil
	},

	Run: func(cmd *cobra.Command, args []string) {
		Send(cmd, args)
	},
}

func init() {

	rootCmd.AddCommand(commandCmd)

	commandCmd.PersistentFlags().IntVarP(&fttype, "fttype", "f", 0, "set fttype \"-f 4194304\"")
	commandCmd.PersistentFlags().StringSliceVarP(&buffer, "buffer", "b", []string{}, "set buffer name \"-b uram0\"")
	commandCmd.PersistentFlags().StringSliceVarP(&data, "data", "d", []string{}, "set data name \"-d unvme-ns-0,unvme-ns-1,unvme-ns-2\"")
	commandCmd.PersistentFlags().StringSliceVarP(&spare, "spare", "s", []string{}, "set spare name \"-s unvme-ns-3\"")
	commandCmd.PersistentFlags().StringVarP(&name, "name", "n", "", "set name \"-n vol01\"")
	commandCmd.PersistentFlags().StringVar(&newName, "newname", "", "set new name \"--newname vol01\"")
	commandCmd.PersistentFlags().StringVar(&size, "size", "", "set size \"--size 4194304\"")
	commandCmd.PersistentFlags().Uint64Var(&maxiops, "maxiops", 0, "set maxiops \"--maxiops 4194304\"")
	commandCmd.PersistentFlags().Uint64Var(&maxbw, "maxbw", 0, "set maxbw \"--maxbw 4194304\"")
	commandCmd.PersistentFlags().StringVarP(&level, "level", "l", "", "set level")
}

func Send(cmd *cobra.Command, args []string) (model.Response, error) {

	var req model.Request
	var res model.Response
	var err error
	var xrId string
	newUUID, err := uuid.NewUUID()
	command := args[0]

	if err == nil {
		xrId = newUUID.String()
	}

	InitConnect()

	_, arrayExists := ArrayCommand[command]
	_, deviceExists := DeviceCommand[command]
	_, systemExists := SystemCommand[command]
	_, volumeExists := VolumeCommand[command]

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

		req, res, err = ArrayCommand[command](xrId, param)
	} else if deviceExists {

		param := model.DeviceParam{}

		if cmd.PersistentFlags().Changed("name") && len(name) > 0 {
			param.Name = name
		}
		if cmd.PersistentFlags().Changed("spare") && len(spare) > 0 {
			param.Spare = spare[0]
		}

		if param != (model.DeviceParam{}) {
			req, res, err = DeviceCommand[command](xrId, param)
		} else {
			req, res, err = DeviceCommand[command](xrId, nil)
		}
	} else if systemExists {

		if command == "wbt" {
			param := model.SystemParam{}
			param.Name = args[1]
			param.Argc = len(args) - 1

			for i, v := range args {
				if i > 1 {
					param.Argv += v + " "
				}
			}
			req, res, err = SystemCommand[command](xrId, param)
		} else {
			if cmd.PersistentFlags().Changed("level") && len(level) > 0 {
				param := model.SystemParam{}
				param.Level = level
				req, res, err = SystemCommand[command](xrId, param)
			} else {
				req, res, err = SystemCommand[command](xrId, nil)
			}
		}
	} else if volumeExists {

		param := model.VolumeParam{}

		param.Name = name

		var v datasize.ByteSize
		err := v.UnmarshalText([]byte(size))
		if err != nil {
			fmt.Println("invalid data metric ", err)
			return res, err
		}
		param.Size = uint64(v)

		if cmd.PersistentFlags().Changed("maxiops") && maxiops > 0 {
			param.Maxiops = maxiops
		}
		if cmd.PersistentFlags().Changed("maxbw") && maxbw > 0 {
			param.Maxbw = maxbw
		}
		if cmd.PersistentFlags().Changed("newname") && len(newName) > 0 {
			param.NewName = newName
		}

		if param == (model.VolumeParam{}) {
			req, res, err = VolumeCommand[command](xrId, nil)
		} else {
			req, res, err = VolumeCommand[command](xrId, param)
		}
	}

	if err != nil {
		fmt.Println(err)
	} else {
		PrintReqRes(req, res)
	}
	return res, err
}

func PrintReqRes(req model.Request, res model.Response) {

	if isQuiet {
		return
	}

	if isJson {
		b, _ := json.Marshal(req)
		fmt.Print("{\n \"Request\":", string(b), ", \n")
		b, _ = json.Marshal(res)
		fmt.Print(" \"Response\":", string(b), "\n}\n")
	} else {
		b, _ := json.MarshalIndent(req.Param, "", "    ")

		fmt.Println("\n\nRequest to Poseidon OS")
		fmt.Println("    xrId        : ", req.Rid)
		fmt.Println("    command     : ", req.Command)

		if string(b) != "null" {
			fmt.Println("    Param       :")
			fmt.Println(string(b))
		}

		fmt.Println("\n\nResponse from Poseidon OS")
		result, err := util.GetStatusInfo(res.Result.Status.Code)
		
		if err == nil {
			fmt.Println("    Code         : ", result.Code)
			fmt.Println("    Level        : ", result.Level)
			fmt.Println("    Description  : ", result.Description)
			fmt.Println("    Problem      : ", result.Problem)
			fmt.Println("    Solution     : ", result.Solution)
		} else {
			
			fmt.Println("    Code        : ", res.Result.Status.Code)
			fmt.Println("    Description : ", res.Result.Status.Description)
			log.Infof("%v\n", err)
		}

		b, _ = json.MarshalIndent(res.Result.Data, "", "    ")

		if string(b) != "null" {
			fmt.Println("    command       : ", string(b))
		}
		fmt.Print("\n\n")
	}
}
