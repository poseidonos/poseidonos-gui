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
 *     * Neither the name of Intel Corporation nor the names of its
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
	"github.com/radovskyb/watcher"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"io/ioutil"
	"magent/src/models"
	"os"
	"testing"
	"time"
)

var airData = `{"group": {"BACKEND_TEST": {"group_id": 4, "node": {"PERF_BACKEND_TEST": {"build": true, "node_id": 10, "objs": [], "run": true, "type": "performance"}}}, "GC": {"group_id": 3, "node": {"PERF_COPY": {"build": false, "node_id": 9, "objs": [], "run": false, "type": "performance"}}}, "M9K": {"group_id": 0, "node": {"LAT_VOLUME_READ": {"build": true, "node_id": 1, "objs": [{"filter": "AIR_BEGIN~AIR_END", "index": 0, "low_qt": 87464, "max": 154828, "mean": 102760, "median": 103083, "min": 69677, "sample_cnt": 97, "target_id": 0, "target_name": "", "total_low_qt": 74577, "total_max": 537449, "total_mean": 87126, "total_median": 84584, "total_min": 11052, "total_sample_cnt": 66865, "total_up_qt": 94865, "up_qt": 115639}], "run": true, "type": "latency"}, "LAT_VOLUME_WRITE": {"build": true, "node_id": 2, "objs": [{"filter": "AIR_BEGIN~AIR_END", "index": 0, "low_qt": 515795, "max": 5485016, "mean": 26209, "median": 2410992, "min": 401267, "sample_cnt": 11, "target_id": 0, "target_name": "", "total_low_qt": 3061472, "total_max": 27544895, "total_mean": 5831103, "total_median": 5795938, "total_min": 115081, "total_sample_cnt": 11506, "total_up_qt": 9038015, "up_qt": 5215429}], "run": true, "type": "latency"}, "PERF_VOLUME": {"build": true, "node_id": 0, "objs": [{"bw": 50562, "bw_avg": 67670597, "cnt_1": "4096(sz)-37033(cnt)", "filter": "AIR_READ", "index": 0, "iops": 12344, "iops_avg": 16336, "target_id": 30228, "target_name": "reactor_0"}, {"bw": 50611, "bw_avg": 67678239, "cnt_1": "4096(sz)-37069(cnt)", "filter": "AIR_WRITE", "index": 0, "iops": 12356, "iops_avg": 16337, "target_id": 30228, "target_name": "reactor_0"}], "run": true, "type": "performance"}}}, "MFS": {"group_id": 1, "node": {"PERF_METAFS_IO": {"build": false, "node_id": 3, "objs": [], "run": false, "type": "performance"}}}, "POS_Q": {"group_id": 2, "node": {"Q_AIO": {"build": false, "node_id": 4, "objs": [], "run": false, "type": "queue"}, "Q_EVENT": {"build": false, "node_id": 7, "objs": [], "run": false, "type": "queue"}, "Q_IO": {"build": false, "node_id": 8, "objs": [], "run": false, "type": "queue"}, "Q_NVRAM": {"build": false, "node_id": 5, "objs": [], "run": false, "type": "queue"}, "Q_SSD": {"build": false, "node_id": 6, "objs": [], "run": false, "type": "queue"}}}}, "interval": 3, "play": true, "timestamp": 1630473119}
`

func TestWatchFile(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	dataChan := make(chan models.ClientPoint, 100)
	go WatchFiles(ctx, "/tmp", `^test[\S]+\.json$`, "air", "air", "default_rp", dataChan)
	go WatchFiles(ctx, "asdqwdqw", "", "air", "air", "default_rp", dataChan)
	time.Sleep(2 * time.Second)
	tmpFile, err := ioutil.TempFile("/tmp", "test*.json")
	if err != nil {
		require.NoError(t, err)
	}
	tmpFile.Close()
	time.Sleep(2 * time.Second)
	f, err := os.OpenFile(tmpFile.Name(), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	require.NoError(t, err)
	time.Sleep(2 * time.Second)
	_, err = f.WriteString(airData)
	require.NoError(t, err)
	f.Close()
	point := <-dataChan
	fields := map[string]interface{}{
		"read_bw":       float64(50562),
		"read_iops":     float64(12344),
		"read_latency":  float64(102760),
		"write_bw":      float64(50611),
		"write_iops":    float64(12356),
		"write_latency": float64(26209),
	}
	assert.Equal(t, point.Fields, fields)

	cancel()
	time.Sleep(5 * time.Second)
	os.Remove(tmpFile.Name())
}

func TestCleanup(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	w := watcher.New()
	tmpFile, err := ioutil.TempFile("/tmp", "test*.json")
	if err != nil {
		require.NoError(t, err)
	}

	fileMap := map[string]interface{}{
		tmpFile.Name(): cancel,
	}
	err = w.Add("/tmp")
	require.NoError(t, err)
	ticker := time.NewTicker(3 * time.Second)
	cleanupFiles(ctx, ticker, w, &fileMap, 1*time.Second)
	assert.Equal(t, fileMap, map[string]interface{}{})
}
