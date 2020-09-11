module cli

go 1.14

replace a-module => ./../a-module

require (
	a-module v0.0.0-00010101000000-000000000000
	github.com/c2h5oh/datasize v0.0.0-20200112174442-28bbd4740fee
	github.com/google/uuid v1.1.1
	github.com/spf13/cast v1.3.0
	github.com/spf13/cobra v0.0.6
	github.com/tidwall/gjson v1.6.0
	github.com/tidwall/pretty v1.0.1 // indirect
)
