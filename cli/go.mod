module cli

go 1.14

replace A-module => ../A-module

require (
	A-module v0.0.0-00010101000000-000000000000
	github.com/c2h5oh/datasize v0.0.0-20200112174442-28bbd4740fee
	github.com/gin-gonic/gin v1.5.0 // indirect
	github.com/google/uuid v1.1.1
	github.com/jstemmer/go-junit-report v0.9.1 // indirect
	github.com/juju/errors v0.0.0-20200330140219-3fe23663418f // indirect
	github.com/spf13/cobra v0.0.6
)
