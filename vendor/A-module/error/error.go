package error

import (
        "fmt"
        "github.com/juju/errors"
       )

func init() {

    err := errors.New("some specific error")
    err = errors.Annotatef(err, "doing that")
    err = errors.Annotatef(err, "doing this")

    fmt.Println(err)
    fmt.Println(errors.ErrorStack(err))
}

func Test() {
    
	fmt.Println("test in error pkg")
}
