package model
type Response struct {
        Rid             string      `json:"rid"`
        LastSuccessTime int64       `json:"lastSuccessTime"`
        Result          Result      `json:"result"`
        Info            interface{} `json:"info,omitempty"`
}

type Result struct {
        Status Status      `json:"status"`
        Data   interface{} `json:"data,omitempty"`
}

type Status struct {
        Module      string `json:"module"`
        Code        int    `json:"code"`
        Level       string `json:"level,omitempty"`
        Description string `json:"description"`
        Problem     string `json:"problem,omitempty"`
        Solution    string `json:"solution,omitempty"`
}

