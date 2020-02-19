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
