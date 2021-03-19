package inputs

import (
	"context"
	"errors"
	"github.com/shirou/gopsutil/cpu"
	"github.com/stretchr/testify/assert"
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
