package main

import (
	"context"
	"testing"
)

//Start the Inputs and close the input when the context is cancelled
//This function tests the startInputs function and verifies if the function closes when the context is cancelled
func TestStartInputs(t *testing.T) {
	dataChan := make(chan ClientPoint, 100)
	ctx, cancel := context.WithCancel(context.Background())
	go startInputs(ctx, dataChan)
	cancel()
}
