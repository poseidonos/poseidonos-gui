module DAgent

go 1.14

replace A-module => ../A-module

require (
	A-module v0.0.0-00010101000000-000000000000
	github.com/gin-gonic/gin v1.5.0
	github.com/google/uuid v1.1.1 // indirect
	github.com/sirupsen/logrus v1.5.0 // indirect
	gopkg.in/yaml.v2 v2.2.8 // indirect
)
