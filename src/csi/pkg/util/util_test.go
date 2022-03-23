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
 
// blackbox test of util package
package util_test

import (
	"sync"
	"sync/atomic"
	"testing"

	"github.com/poseidonos/pos-csi/pkg/util"
)

func TestTryLockSequential(t *testing.T) {
	var tryLock util.TryLock

	// acquire lock
	if !tryLock.Lock() {
		t.Fatalf("failed to acquire lock")
	}
	// acquire a locked lock should fail
	if tryLock.Lock() {
		t.Fatalf("acquired a locked lock")
	}
	// acquire a released lock should succeed
	tryLock.Unlock()
	if !tryLock.Lock() {
		t.Fatal("failed to acquire a release lock")
	}
}

func TestTryLockConcurrent(t *testing.T) {
	var tryLock util.TryLock
	var wg sync.WaitGroup
	var lockCount int32
	const taskCount = 50

	// only one task should acquire the lock
	for i := 0; i < taskCount; i++ {
		wg.Add(1)
		go func() {
			if tryLock.Lock() {
				atomic.AddInt32(&lockCount, 1)
			}
			wg.Done()
		}()
	}
	wg.Wait()

	if lockCount != 1 {
		t.Fatal("concurrency test failed")
	}
}
