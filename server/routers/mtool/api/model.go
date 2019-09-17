package api

type Request struct {
	Command string      `yaml:"command"`
	Rid     string      `yaml:"rid"`
	Param   interface{} `yaml:"param"`
}

type Response struct {
	Rid    string `yaml:"rid"`
	Result Result `yaml:"result"`
}

type Result struct {
	Status Status      `yaml:"status"`
	Data   interface{} `yaml:"data"`
}

type Status struct {
	Code        int    `yaml:"code"`
	Description string `yaml:"description"`
}
