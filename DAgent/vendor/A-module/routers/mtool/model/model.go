package model

type Request struct {
	Command string      `json:"command"`
	Rid     string      `json:"rid"`
	Param   interface{} `json:"param,omitempty"`
}

type Response struct {
	Rid    string `json:"rid"`
	Result Result `json:"result"`
	Info   Info   `json:"info"`
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
	StatusList []Status `json:"StatusList"`
}

type Info struct {
	State              string `json:"state"`
	Situation          string `json:"situation"`
	RebuildingProgress string `json:"rebuliding_progress"`
	Capacity           string `json:"capacity"`
	Used               string `json:"used"`
}

type Device struct {
	DeviceName string `json:"deviceName"`
}

type SystemParam struct {
	Level string `json:"level,omitempty"`
	Name  string `json:"testname,omitempty"`
	Argc  int    `json:"argc,omitempty"`
	Argv  string `json:"argv,omitempty"`
}

type ArrayParam struct {
	FtType int      `json:"fttype,omitempty"`
	Buffer []Device `json:"buffer,omitempty"`
	Data   []Device `json:"data,omitempty"`
	Spare  []Device `json:"spare,omitempty"`
}

type DeviceParam struct {
	Name  string `json:"name,omitempty"`
	Spare string `json:"spare,omitempty"`
}

type VolumeParam struct {
	Name    string `json:"name,omitempty"`
	NewName string `json:"newname,omitempty"`
	Size    int    `json:"size,omitempty"`
	Maxiops int    `json:"maxiops,omitempty"`
	Maxbw   int    `json:"maxbw,omitempty"`
}
