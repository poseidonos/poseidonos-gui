package model

type Request struct {
	Command string      `json:"command"`
	Rid     string      `json:"rid"`
	Param   interface{} `json:"param,omitempty"`
}

type Response struct {
	Rid    string `json:"rid"`
	Result Result `json:"result"`
}

type Result struct {
	Status Status      `json:"status"`
	Data   interface{} `json:"data,omitempty"`
}

type Status struct {
	Code        int    `json:"code"`
	Description string `json:"description"`
}

type StatusList struct {
	StatusList []     Status `json:"StatusList"`
}

type Device struct {
	DeviceName string `json:"deviceName"`
}

type ArrayParam  struct {
	FtType  int	        `json:"fttype,omitempty"`
	Buffer []  Device   `json:"buffer,omitempty"`
	Data []  Device     `json:"data,omitempty"`
	Spare []  Device    `json:"spare,omitempty"`
}

type DeviceParam  struct {
	Name string	`json:"name"`
}

type VolumeParam struct {
	Name string	`json:"name,omitempty"`
	Size int	`json:"size,omitempty"`
	Maxiops int	`json:"maxiops,omitempty"`
	Maxbw int	`json:"maxbw,omitempty"`

}

type WBTParam struct {
	Name string `json:"testname,omitempty"`
	Argc int `json:"argc,omitempty"`
	Argv string `json:"argv"`
}
