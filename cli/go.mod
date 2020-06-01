module cli

go 1.14

replace A-module => ../A-module

require (
	A-module v0.0.0-00010101000000-000000000000
	github.com/c2h5oh/datasize v0.0.0-20200112174442-28bbd4740fee
	github.com/google/uuid v1.1.1
	github.com/spf13/cobra v0.0.6
	github.com/stretchr/testify v1.4.0 // indirect
	golang.org/x/sys v0.0.0-20190813064441-fde4db37ae7a // indirect
)
