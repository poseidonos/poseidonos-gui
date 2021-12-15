/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package inputs

import (
	"context"
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"io/ioutil"
	"magent/src/models"
	"os"
	"testing"
	"time"
)

//Should start reading from the beginning of the file
//This function creates temporary test file and calls the TailFile function
//It verifies if the whole data in the file is passed to the channel
func TestTailFileFromBeginning(t *testing.T) {
	tmpFile, err := ioutil.TempFile("", "test*.json")
	if err != nil {
		require.NoError(t, err)
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()
	data := []string{
		"{\"field1\": 20, \"field2\": 30}\n",
		"{\"field1\": 40, \"field2\": 50}\n",
	}
	for _, line := range data {
		if _, err := tmpFile.WriteString(line); err != nil {
			require.NoError(t, err)
		}
	}
	testDataChan := make(chan models.ClientPoint, 10)
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		//Write metric obtained by tailing file to data channel
		TailFile(ctx, true, tmpFile.Name(), "json", "", "", testDataChan)
	}()
	data = append(data, "{\"field1\": 50, \"field2\": 60}\n")
	if _, err := tmpFile.WriteString(data[2]); err != nil {
		require.NoError(t, err)
	}
	fields := map[string]interface{}{}
	for i := 0; i < 3; i++ {
		str := <-testDataChan
		json.Unmarshal([]byte(data[i]), &fields)
		assert.Equal(t, str.Fields, fields)
	}
	close(testDataChan)
	cancel()
}

//Should start reading from the end of the file
//This function creates temporary test file and calls the TailFile function
//It verifies if only the appended data in the file is passed to the channel
func TestTailFileEnd(t *testing.T) {
	tmpFile, err := ioutil.TempFile("", "test*.json")
	if err != nil {
		require.NoError(t, err)
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()
	data := []string{
		"{\"field1\": 20, \"field2\": 30}\n",
		"{\"field1\": 40, \"field2\": 50}\n",
	}
	for _, line := range data {
		if _, err := tmpFile.WriteString(line); err != nil {
			require.NoError(t, err)
		}
	}
	testDataChan := make(chan models.ClientPoint, 10)
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		TailFile(ctx, false, tmpFile.Name(), "json", "", "", testDataChan)
	}()
	time.Sleep(2 * time.Second)
	line := "{\"field1\": 50, \"field2\": 60}\n"
	if _, err := tmpFile.WriteString(line); err != nil {
		require.NoError(t, err)
	}
	fields := map[string]interface{}{}
	str := <-testDataChan
	json.Unmarshal([]byte(line), &fields)
	assert.Equal(t, str.Fields, fields)
	close(testDataChan)
	cancel()
}

//Should convert nested JSON to line protocol
//This function creates temporary test file and calls the TailFile function
//It verifies if the nested JSON format is conerted to line protocol and passed to the channel
func TestTailFileNested(t *testing.T) {
	tmpFile, err := ioutil.TempFile("", "test*.json")
	if err != nil {
		require.NoError(t, err)
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()
	data := []string{
		"{\"field1\": 20, \"field2\": 30, \"field3\": [{\"f\": 40}], \"field4\": \"test\", \"field5\": true, \"field6\": null}\n",
	}
	line := "{\"field1\": 20, \"field2\": 30, \"field3_0_f\": 40, \"field4\": \"test\", \"field5\": true}\n"
	for _, line := range data {
		if _, err := tmpFile.WriteString(line); err != nil {
			require.NoError(t, err)
		}
	}
	testDataChan := make(chan models.ClientPoint, 10)
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		TailFile(ctx, true, tmpFile.Name(), "json", "", "", testDataChan)
	}()
	fields := map[string]interface{}{}
	str := <-testDataChan
	json.Unmarshal([]byte(line), &fields)
	assert.Equal(t, str.Fields, fields)
	close(testDataChan)
	cancel()
}

//Should write plain text to DB
//This function creates temporary test file and calls the TailFile function
//It verifies if the plain text in the file is passed to the channel
func TestTailFileText(t *testing.T) {
	tmpFile, err := ioutil.TempFile("", "test*.txt")
	if err != nil {
		require.NoError(t, err)
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()
	data := []string{
		"Plain Text Line 1\n",
	}
	line := "Plain Text Line 1"
	for _, line := range data {
		if _, err := tmpFile.WriteString(line); err != nil {
			require.NoError(t, err)
		}
	}
	testDataChan := make(chan models.ClientPoint, 10)
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		TailFile(ctx, true, tmpFile.Name(), "text", "", "", testDataChan)
	}()
	fields := map[string]interface{}{}
	str := <-testDataChan
	fields["value"] = line
	fields["host"], _ = os.Hostname()
	assert.Equal(t, str.Fields, fields)
	close(testDataChan)
	cancel()
}

//Should not write metric if data obtained from tail file is not in proper JSON format
//This function creates temporary test file and calls the TailFile function
//It verifies if invalid JSON data in the file is not passed to the channel
func TestTailFileInvalid(t *testing.T) {
	tmpFile, err := ioutil.TempFile("", "test*.json")
	if err != nil {
		require.NoError(t, err)
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()
	data := []string{
		"{\"field1\": 20, \"field2\": \"3\"0}\n",
		"{\"field1\": 40, \"field2\": 50\n",
	}
	for _, line := range data {
		if _, err := tmpFile.WriteString(line); err != nil {
			require.NoError(t, err)
		}
	}
	testDataChan := make(chan models.ClientPoint, 10)
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		TailFile(ctx, true, tmpFile.Name(), "json", "", "", testDataChan)
	}()
	time.Sleep(2 * time.Second)
	assert.Equal(t, len(testDataChan), 0)
	close(testDataChan)
	cancel()
}
