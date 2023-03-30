module dagent

go 1.14

replace kouros => ./../kouros

replace pnconnector => ./../pnconnector

require (
	github.com/ghodss/yaml v1.0.0
	github.com/gin-gonic/gin v1.6.3
	github.com/google/uuid v1.3.0
	github.com/mattn/go-isatty v0.0.12 // indirect
	github.com/shettyh/tlock v1.0.0 // indirect
	github.com/stretchr/testify v1.7.0
	github.com/viney-shih/go-lock v1.1.2 // indirect
	google.golang.org/grpc v1.49.0 // indirect
	google.golang.org/protobuf v1.28.1
	gopkg.in/yaml.v2 v2.4.0 // indirect
	gopkg.in/yaml.v3 v3.0.0-20200313102051-9f266ea9e77c // indirect
	kouros v0.0.0-00010101000000-000000000000
	pnconnector v0.0.0-00010101000000-000000000000
)
