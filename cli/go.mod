module cli

go 1.14

replace A-module => ../A-module

require (
	A-module v0.0.0-00010101000000-000000000000
	github.com/gin-gonic/gin v1.5.0 // indirect
	github.com/google/uuid v1.1.1
	github.com/jstemmer/go-junit-report v0.9.1 // indirect
	github.com/juju/errors v0.0.0-20190930114154-d42613fe1ab9 // indirect
	github.com/spf13/cobra v0.0.6
)
