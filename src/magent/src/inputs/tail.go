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
	"github.com/hpcloud/tail"
	"io"
	"log"
	"magent/src/models"
	"magent/src/util"
	"os"
	"strings"
	"time"
)

// TailFile watches a file for changes and will send the changes to the channel
func TailFile(ctx context.Context, fromBeginning bool, name string, format string, measurement string, rp string, dataChan chan models.ClientPoint) {
	position := io.SeekStart
	if !fromBeginning {
		position = io.SeekEnd
	}
	t, _ := tail.TailFile(name, tail.Config{
		Follow: true,
		Location: &tail.SeekInfo{
			Offset: 0,
			Whence: position,
		},
	})
	defer log.Println("Closing Tail Input")
	defer handlePanic()
	for {
		select {
		case <-ctx.Done():
			_ = t.Stop()
			return
		case line := <-t.Lines:
			tags := map[string]string{}
			fields := map[string]interface{}{}
			points := []models.AIRPoint{}
			switch strings.ToLower(format) {
			case "air":
				err := formatAIRJSON(line, &points)
				if err != nil {
					log.Println("Error in formatting AIR data: ", err)
					continue
				}
				for _, pt := range points {
					newPoint := models.ClientPoint{
						Fields:          pt.Fields,
						Tags:            pt.Tags,
						Measurement:     measurement,
						Timestamp:       time.Unix(int64(pt.Timestamp), 0),
						RetentionPolicy: rp,
					}
					dataChan <- newPoint
				}
			case "json":
				err := formatJSON(line, &fields, &tags)
				if err != nil {
					continue
				}
				newPoint := models.ClientPoint{
					Fields:          fields,
					Tags:            tags,
					Measurement:     measurement,
					RetentionPolicy: rp,
				}
				dataChan <- newPoint
			default:
				fields["value"] = line.Text
				fields["host"], _ = os.Hostname()
				newPoint := models.ClientPoint{
					Fields:          fields,
					Tags:            tags,
					Measurement:     measurement,
					RetentionPolicy: rp,
				}
				dataChan <- newPoint
			}
		}
	}
}

func formatJSON(line *tail.Line, fields *map[string]interface{}, tags *map[string]string) error {
	text := strings.TrimRight(line.Text, "\r")
	return util.Parse([]byte(text), fields, tags)
}

func formatAIRJSON(line *tail.Line, points *[]models.AIRPoint) error {
	text := strings.TrimRight(line.Text, "\r")
	return util.FormatAIRJSON([]byte(text), points)
}

func handlePanic() {
	if err := recover(); err != nil {
		log.Println("panic occured during file monitor: ", err)
	}
}
