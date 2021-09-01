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
	"log"
	"magent/src/models"
	"regexp"
	"time"
)

//  Watchfiles watches for file changes on the specified directory for files with names matching the given regular expression
func WatchFiles(ctx context.Context, dir, expression, format, db, rp string, dataChan chan models.ClientPoint) {
	pendingContexts := []context.CancelFunc{}
	fileMap := map[string]interface{}{}
	w := watcher.New()
	r := regexp.MustCompile(expression)
	w.AddFilterHook(watcher.RegexFilterHook(r, false))

	// Go routine for capturing the file changes
	go func() {
		for {
			select {
			case event := <-w.Event:
				switch event.Op {
				case watcher.Write, watcher.Create:
					if _, ok := fileMap[event.Path]; !ok && !event.IsDir() {
						airCtx, airCtxCancel := context.WithCancel(context.Background())
						fileMap[event.Path] = airCtxCancel
						pendingContexts = append(pendingContexts, airCtxCancel)
						go TailFile(airCtx, false, event.Path, format, db, rp, dataChan)
					}
				}
			case err := <-w.Error:
				log.Println("Error in watcher: ", err)
			case <-ctx.Done():
				for _, cancelFunc := range pendingContexts {
					cancelFunc()
				}
				w.Close()
				return
			}
		}
	}()

	ticker := time.NewTicker(12 * time.Hour)
	go cleanupFiles(ctx, ticker, w, &fileMap, 24*time.Hour)
	if err := w.Add(dir); err != nil {
		log.Println("Error watching files", err)
	}

	if err := w.Start(time.Millisecond * 100); err != nil {
		log.Fatal(err)
	}
}

func cleanupFiles(ctx context.Context, ticker *time.Ticker, w *watcher.Watcher, fileMap *map[string]interface{}, interval time.Duration) {
	for {
		select {
		case <-ctx.Done():
			ticker.Stop()
			return
		case <-ticker.C:
			for path, f := range w.WatchedFiles() {
				if v, ok := (*fileMap)[path]; ok {
					if (time.Now().Sub(f.ModTime())) > interval {
						log.Println("Closing " + path + " from watching")
						v.(context.CancelFunc)()
						delete(*fileMap, path)
					}
				}
			}
		}
	}
}
