package csi

import (
	"csi/driver"
	"fmt"
)

func main() {

	fmt.Println("csi_main entrypoint")

	drv, err := driver.NewDriver()
}
