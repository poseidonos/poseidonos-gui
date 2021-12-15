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

package util

import (
	"github.com/stretchr/testify/require"
	"magent/src/models"
	"testing"
)

var airData = `{"group": {"BACKEND_TEST": {"group_id": 4, "node": {"PERF_BACKEND_TEST": {"build": true, "node_id": 10, "objs": [], "run": true, "type": "performance"}}}, "GC": {"group_id": 3, "node": {"PERF_COPY": {"build": false, "node_id": 9, "objs": [], "run": false, "type": "performance"}}}, "M9K": {"group_id": 0, "node": {"LAT_ARR_VOL_READ": {"build": true, "node_id": 1, "objs": [], "run": true, "type": "latency"}, "LAT_ARR_VOL_WRITE": {"build": true, "node_id": 2, "objs": [], "run": true, "type": "latency"}, "PERF_ARR_VOL": {"build": true, "node_id": 0, "objs": [], "run": true, "type": "performance"}}}, "MFS": {"group_id": 1, "node": {"PERF_METAFS_IO": {"build": false, "node_id": 3, "objs": [], "run": false, "type": "performance"}}}, "POS_Q": {"group_id": 2, "node": {"Q_AIO": {"build": false, "node_id": 4, "objs": [], "run": false, "type": "queue"}, "Q_EVENT": {"build": false, "node_id": 7, "objs": [], "run": false, "type": "queue"}, "Q_IO": {"build": false, "node_id": 8, "objs": [], "run": false, "type": "queue"}, "Q_NVRAM": {"build": false, "node_id": 5, "objs": [], "run": false, "type": "queue"}, "Q_SSD": {"build": false, "node_id": 6, "objs": [], "run": false, "type": "queue"}}}}, "interval": 3, "play": true, "timestamp": 1630409821}`

func TestFormatAIRJSON(t *testing.T) {
	airPoints := []models.AIRPoint{}
	err := FormatAIRJSON([]byte(airData), &airPoints)
	require.NoError(t, err)
	err = FormatAIRJSON([]byte("{"), &airPoints)
	require.Error(t, err)
}
