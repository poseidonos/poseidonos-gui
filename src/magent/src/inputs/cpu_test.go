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
	"errors"
	"github.com/shirou/gopsutil/cpu"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"magent/src/models"
	"sync"
	"testing"
	"time"
)

type magentCPUTest struct {
	//mock.Mock
}

var index = 0

func (m magentCPUTest) Times(percpu bool) ([]cpu.TimesStat, error) {
	index++
	switch index {
	case 1, 2, 3, 4:
		if percpu == false {
			return []cpu.TimesStat{{
				CPU:       "cpu-total",
				User:      2189101.1,
				System:    324770.5,
				Idle:      152332131.9,
				Nice:      269.9,
				Iowait:    19528.3,
				Irq:       0.0,
				Softirq:   11244.9,
				Steal:     0.0,
				Guest:     0.0,
				GuestNice: 0.0,
			}}, nil
		}
		if percpu == true {
			return []cpu.TimesStat{{
				CPU:       "cpu0",
				User:      2189101.1,
				System:    324770.5,
				Idle:      152332131.9,
				Nice:      269.9,
				Iowait:    19528.3,
				Irq:       0.0,
				Softirq:   11244.9,
				Steal:     0.0,
				Guest:     0.0,
				GuestNice: 0.0,
			}, {
				CPU:       "cpu1",
				User:      2189101.1,
				System:    324770.5,
				Idle:      152332131.9,
				Nice:      269.9,
				Iowait:    19528.3,
				Irq:       0.0,
				Softirq:   11244.9,
				Steal:     0.0,
				Guest:     0.0,
				GuestNice: 0.0,
			}}, nil
		}
	case 5, 6:
		return nil, errors.New("Fetching Error")
	case 7, 8, 11, 12:
		if percpu == false {
			return []cpu.TimesStat{{
				CPU:       "cpu-total",
				User:      8.8,
				System:    8.2,
				Idle:      80.1,
				Nice:      1.3,
				Iowait:    0.8389,
				Irq:       0.6,
				Softirq:   0.11,
				Steal:     0.511,
				Guest:     3.1,
				GuestNice: 0.324,
			}}, nil
		}
		if percpu == true {
			return []cpu.TimesStat{{
				CPU:       "cpu0",
				User:      8.8,
				System:    8.2,
				Idle:      80.1,
				Nice:      1.3,
				Iowait:    0.8389,
				Irq:       0.6,
				Softirq:   0.11,
				Steal:     0.511,
				Guest:     3.1,
				GuestNice: 0.324,
			}}, nil
		}
	case 9, 10, 13, 14:
		if percpu == false {
			return []cpu.TimesStat{{
				CPU:       "cpu-total",
				User:      24.9,
				System:    10.9,
				Idle:      157.9798,
				Nice:      3.5,
				Iowait:    0.929,
				Irq:       1.2,
				Softirq:   0.31,
				Steal:     0.2812,
				Guest:     11.4,
				GuestNice: 2.524,
			}}, nil
		}
		if percpu == true {
			return []cpu.TimesStat{{
				CPU:       "cpu-total",
				User:      24.9,
				System:    10.9,
				Idle:      157.9798,
				Nice:      3.5,
				Iowait:    0.929,
				Irq:       1.2,
				Softirq:   0.31,
				Steal:     0.2812,
				Guest:     11.4,
				GuestNice: 2.524,
			}}, nil
		}
	case 15:
		return nil, errors.New("Failed to get cpu Time")
	default:
		if percpu == false {
			return []cpu.TimesStat{{
				CPU:       "cpu-total",
				User:      24.9,
				System:    10.9,
				Idle:      157.9798,
				Nice:      3.5,
				Iowait:    0.929,
				Irq:       1.2,
				Softirq:   0.31,
				Steal:     0.2812,
				Guest:     11.4,
				GuestNice: 2.524,
			}}, nil
		}
		if percpu == true {
			return []cpu.TimesStat{{
				CPU:       "cpu-total",
				User:      24.9,
				System:    10.9,
				Idle:      157.9798,
				Nice:      3.5,
				Iowait:    0.929,
				Irq:       1.2,
				Softirq:   0.31,
				Steal:     0.2812,
				Guest:     11.4,
				GuestNice: 2.524,
			}}, nil
		}
	}
	return []cpu.TimesStat{{
		CPU:       "cpu-total",
		User:      24.9,
		System:    10.9,
		Idle:      157.9798,
		Nice:      3.5,
		Iowait:    0.929,
		Irq:       1.2,
		Softirq:   0.31,
		Steal:     0.2812,
		Guest:     11.4,
		GuestNice: 2.524,
	}}, nil

}

//Test the cpuTimes function
//This function calls the cpuTimes function and verifies if it receives cpu Times per cpu and for total cpu based on the input parameters
func TestCpuTimes(t *testing.T) {
	magentCPU = magentCPUTest{}

	//Get CPU times per CPU and Total CPU times
	times, _ := cpuTimes(magentCPU, true, true)
	assert.Len(t, times, 3)

	//Get CPU times per CPU
	times, _ = cpuTimes(magentCPU, true, false)
	assert.Len(t, times, 2)

	//Get total CPU times
	times, _ = cpuTimes(magentCPU, false, true)
	assert.Len(t, times, 1)

	//Test error cases
	times, _ = cpuTimes(magentCPU, true, true)
	times, _ = cpuTimes(magentCPU, false, true)
}

//Write CPU Times to output data channel
//This function tests the CollectCPUData function and verifies if the CollectCPUData outputs the correct cpu information to the passed channel
func TestGetCPUData(t *testing.T) {
	magentCPU = magentCPUTest{}
	var wg sync.WaitGroup
	dataChan := make(chan models.ClientPoint, 10)
	ctx, cancel := context.WithCancel(context.Background())
	wg.Add(1)
	go func() {
		defer wg.Done()
		CollectCPUData(ctx, dataChan)
	}()
	go func() {
		for data := range dataChan {
			assert.InDelta(t, data.Fields["usage_user"], 7.8, 0.05)
		}
	}()
	time.Sleep(2500 * time.Millisecond)
	cancel()
	wg.Wait()
	close(dataChan)
}

func TestGetCPUErr(t *testing.T) {
	magentCPU = magentCPUTest{}
	var wg sync.WaitGroup
	dataChan := make(chan models.ClientPoint, 10)
	ctx, cancel := context.WithCancel(context.Background())
	wg.Add(1)
	go func() {
		defer wg.Done()
		CollectCPUData(ctx, dataChan)
	}()
	/*
	   go func() {
	           for data := range dataChan {
	                   assert.InDelta(t, data.Fields["usage_user"], 7.8, 0.05)
	           }
	   }()
	*/
	time.Sleep(2500 * time.Millisecond)
	cancel()
	wg.Wait()
	close(dataChan)
}

func TestGetCPUActual(t *testing.T) {
	magentCPUReal := MAgentCPU{}
	_, err := magentCPUReal.Times(false)
	require.NoError(t, err)
}
