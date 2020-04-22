package log

import (
	"os"
	"github.com/sirupsen/logrus"
)

func init() {
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.WarnLevel)
	logrus.SetFormatter(&logrus.TextFormatter{ForceColors: true})
}

//set Warn as a default log level.
//log level grows like below.

func SetDebugMode() {
	logrus.SetLevel(logrus.DebugLevel)
}

func SetVerboseMode() {
	logrus.SetLevel(logrus.InfoLevel)
}

func Debug(args ...interface{}) {
     logrus.Debug(args...)
}

func Info(args ...interface{}) {
     logrus.Info(args...)
}

func Warn(args ...interface{}) {
     logrus.Warn(args...)
}

func Error(args ...interface{}) {
     logrus.Error(args...)
}

func Critical(args ...interface{}) {
     logrus.Fatal(args...)
}

func Printf(format string, args ...interface{}) {
     logrus.Printf(format, args...)
}

func Fatal(args ...interface{}) {
     logrus.Fatal(args...)
}

func Fatalf(format string, args ...interface{}) {
     logrus.Fatalf(format, args...)
}
