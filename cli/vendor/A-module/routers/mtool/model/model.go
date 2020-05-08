package model

type Request struct {
	Command string      `json:"command"`
	Rid     string      `json:"rid"`
	Param   interface{} `json:"param,omitempty"`
}

type Response struct {
	Rid             string `json:"rid"`
	LastSuccessTime int64  `json:"lastSuccessTime"`
	Result          Result `json:"result"`
	Info            Info   `json:"info"`
}

type Result struct {
	Status Status      `json:"status"`
	Data   interface{} `json:"data,omitempty"`
}

type Status struct {
	Module      string `json:"module"`
	Code        int    `json:"code"`
	Description string `json:"description"`
	Problem     string `json:"problem,omitempty"`
	Solution    string `json:"solution,omitempty"`
}

type StatusList struct {
	StatusList []Status `json:"StatusList"`
}

type Info struct {
	State              string `json:"state"`
	Situation          string `json:"situation"`
	RebuildingProgress uint32 `json:"rebuliding_progress"`
	Capacity           uint64 `json:"capacity"`
	Used               uint64 `json:"used"`
}

type Device struct {
	DeviceName string `json:"deviceName"`
}

type SystemParam struct {
	Level string `json:"level,omitempty"`
	Name  string `json:"testname,omitempty"`
	Argc  int    `json:"argc"`
	Argv  string `json:"argv"`
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
	Size    uint64 `json:"size,omitempty"`
	Maxiops uint32 `json:"maxiops,omitempty"`
	Maxbw   uint32 `json:"maxbw,omitempty"`
}
