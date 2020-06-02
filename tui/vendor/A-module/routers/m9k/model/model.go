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
	Name        string `json:"name,omitempty"`
	NewName     string `json:"newname,omitempty"`
	Size        uint64 `json:"size,omitempty"`
	Maxiops     uint64 `json:"maxiops,omitempty"`
	Maxbw       uint64 `json:"maxbw,omitempty"`
	NameSuffix  uint64 `json:"namesuffix,omitempty"`
	TotalCount  uint64 `json:"totalcount,omitempty"`
	StopOnError bool   `json:"stoponerror,omitempty"`
	MountAll    bool   `json:"mountall,omitempty"`
}

type CallbackMultiVol struct {
	TotalCount    int
	Pass          int
	Fail          int
	MultiVolArray []Response
}

type WBTParam struct {
	TestName string  `json:"testname,omitempty"`
	Argv     WBTArgv `json:"argv"`
}

type WBTArgv struct {
	Name      string `json:"name,omitempty"`
	Input     string `json:"input,omitempty"`
	Output    string `json:"output,omitempty"`
	Integrity string `json:"integrity,omitempty"`
	Access    string `json:"access,omitempty"`
	Operation string `json:"operation,omitempty"`
	Rba       string `json:"rba,omitempty"`
	Lba       string `json:"lba,omitempty"`
	Vsid      string `json:"vsid,omitempty"`
	Lsid      string `json:"lsid,omitempty"`
	Offset    string `json:"offset,omitempty"`
	Size      string `json:"size,omitempty"`
	Count     string `json:"count,omitempty"`
	Pattern   string `json:"pattern,omitempty"`
	Loc       string `json:"loc,omitempty"`
	Fd        string `json:"fd,omitempty"`
	Dev       string `json:"dev,omitempty"`
	Normal    string `json:"normal,omitempty"`
	Urgent    string `json:"urgent,omitempty"`
}

type BuildInfo struct {
	GitHash   string `json:"githash"`
	BuildTime int64 `json:"build_time"`
}