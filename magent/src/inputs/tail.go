package inputs

import (
	"context"
	"github.com/hpcloud/tail"
	"io"
	"log"
	"os"
	"strings"
	"magent/src/models"
	"magent/src/util"
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
	for {
		select {
		case <-ctx.Done():
			_ = t.Stop()
			return
		case line := <-t.Lines:
			tags := map[string]string{}
			fields := map[string]interface{}{}
			switch format {
			case "json", "JSON":
				err := formatJSON(line, &fields, &tags)
				if err != nil {
					continue
				}
			default:
				fields["value"] = line.Text
				fields["host"], _ = os.Hostname()
			}
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

func formatJSON(line *tail.Line, fields *map[string]interface{}, tags *map[string]string) error {
	text := strings.TrimRight(line.Text, "\r")
	return util.Parse([]byte(text), fields, tags)
}
