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
			switch format {
			case "air":
				err := formatAIRJSON(line, &points)
				if err != nil {
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
			case "json", "JSON":
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
