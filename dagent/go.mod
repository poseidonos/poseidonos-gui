module dagent

go 1.14

replace pnconnector => ./../pnconnector

require (
	pnconnector v0.0.0-00010101000000-000000000000
	github.com/gin-gonic/gin v1.6.3
	github.com/stretchr/testify v1.5.1
)
