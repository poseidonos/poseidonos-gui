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

package pos

var volumeInfo = map[string]string{
	"transportType":      "rdma",
	"targetAddress":      "172.30.6.8,172.30.6.10,172.30.6.12",
	"transportServiceId": "1158",
	"arrayName":          "POSArray",
	"provisionerIP":      "172.20.6.8,172.20.6.10,172.20.6.12",
	"provisionerPort":    "3000",
	"serialNumber":       "POS0000000003",
	"modelNumber":        "IBOF_VOLUME_EEEXTENSION",
	"maxNamespaces":      "256",
	"allowAnyHost":       "true",
	"bufCacheSize":       "64",
	"numSharedBuf":       "4096",
}

const infiniteVolumeSize = 204800 * 204800 * 204800
const idempotencyCount = 10
const concurrencyCount = 1 //As It fails sometimes if count > 1

const nodeVolumeName = "new-voll-4"

var stagingTargetPath = "/tmp"
var targetPath = "/tmp/test-pub6"
var wrongStagingTargetPath = "/wrong-path/ddd" //make sure this path doesnot exist
