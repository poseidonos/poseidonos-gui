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
	fileMap := map[string]bool{}
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
						fileMap[event.Path] = true
						airCtx, airCtxCancel := context.WithCancel(context.Background())
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
	if err := w.Add(dir); err != nil {
		log.Println("Error watching files", err)
	}

	if err := w.Start(time.Millisecond * 100); err != nil {
		log.Fatal(err)
	}
}
