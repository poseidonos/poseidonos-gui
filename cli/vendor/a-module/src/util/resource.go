// Code generated for package util by go-bindata DO NOT EDIT. (@generated)
// sources:
// ../resources/events.yaml
package util

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func bindataRead(data []byte, name string) ([]byte, error) {
	gz, err := gzip.NewReader(bytes.NewBuffer(data))
	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}

	var buf bytes.Buffer
	_, err = io.Copy(&buf, gz)
	clErr := gz.Close()

	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}
	if clErr != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

type asset struct {
	bytes []byte
	info  os.FileInfo
}

type bindataFileInfo struct {
	name    string
	size    int64
	mode    os.FileMode
	modTime time.Time
}

// Name return file name
func (fi bindataFileInfo) Name() string {
	return fi.name
}

// Size return file size
func (fi bindataFileInfo) Size() int64 {
	return fi.size
}

// Mode return file mode
func (fi bindataFileInfo) Mode() os.FileMode {
	return fi.mode
}

// Mode return file modify time
func (fi bindataFileInfo) ModTime() time.Time {
	return fi.modTime
}

// IsDir return file whether a directory
func (fi bindataFileInfo) IsDir() bool {
	return fi.mode&os.ModeDir != 0
}

// Sys return file is sys mode
func (fi bindataFileInfo) Sys() interface{} {
	return nil
}

var _ResourcesEventsYaml = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\xc4\x5d\xdd\x6e\x1c\xb7\x92\xbe\xcf\x53\x10\xba\x38\x27\x01\x24\xaf\x35\x3f\xb6\xa4\x3b\x59\x3f\x5e\x1d\x58\x96\x8f\xc6\xf6\xd9\xbd\x0a\x38\xdd\x9c\x19\x46\xdd\x64\x87\x64\x4b\x9a\x04\x79\x17\x3d\x8b\x9e\x6c\xc1\x9f\xfe\x1b\xb2\x7b\x6a\x38\x46\x36\x40\x00\x4b\x62\xf3\xab\x22\x8b\xc5\xaa\x62\xb1\x78\x74\x74\xf4\xd3\x47\x8e\xb3\x33\x74\xf5\x48\x98\x92\xe8\x1b\xa3\x0b\x9a\x60\x45\x39\xfb\xe9\x3b\x11\x92\x72\x76\x86\x0e\x1e\xdf\x9c\x9c\x1e\xfc\x94\xf3\xb4\xcc\x88\x3c\xfb\x09\xa1\x23\xc4\x70\x4e\xce\xd0\xc1\xc5\xdd\xed\xed\xdd\xe7\x83\x9f\x10\x42\x28\xe1\x25\x53\x67\xe8\xf4\xf4\xd4\xfc\x48\xd3\x99\xc2\x42\x9d\xa1\xb7\xee\xc7\x2b\x96\x9e\x21\xd4\xfc\x9d\x2d\xf8\x99\xf9\x97\xee\x2f\xe1\x29\xa9\x9a\xea\xff\x32\xf2\x48\xb2\x33\x74\x70\xf3\xf9\xfa\xee\xa0\xfe\x6d\x4e\xa4\xc4\x4b\x0d\x3c\x2b\x93\x84\x48\xd9\xfc\xa9\x10\x7c\x9e\x91\xfc\x0c\x1d\x34\xbf\x93\x3c\x2b\x95\x65\xe1\xa0\x43\xf5\xa7\x9b\x0e\xc9\xc7\x6f\xdf\x76\x49\x3e\x7e\xfb\x76\x83\xea\xe3\xb7\x03\x64\xd7\xcd\x5b\x94\x6b\xc2\x7d\xba\xe9\x9c\x2f\xb8\x44\x54\x22\xa9\x91\x48\xea\xd1\xef\x13\xef\x83\x1d\xef\x0a\xa6\x88\xc8\x29\xc3\xb1\x78\x23\x18\x5e\x92\x51\x24\x89\x78\x24\x42\x63\x52\x46\x15\xc5\x19\xfd\x23\x12\x74\x0c\x03\x65\xe4\x49\x03\x13\xa6\x34\x68\xc2\x19\x23\x49\x2c\x9f\x13\x30\x9f\x0e\x2e\xa5\x72\x3f\xc4\x29\x0c\x51\x90\xdf\x4b\x22\x15\xca\xe5\x52\xc3\x0a\x92\x10\xfa\x18\x09\xf9\x0e\x0a\x29\x0b\xce\x24\xa9\x30\x25\x61\x2a\x06\xef\x18\xb8\x32\x5a\xc2\x53\x08\x52\x60\x41\xd9\x12\x91\x67\x1a\x07\x0a\x5c\x21\x2d\x50\xb5\x12\x04\xa7\xe8\x37\x4e\x59\xdc\xc0\x1e\x03\x57\x09\x61\x78\x9e\x11\x24\x48\x29\xc9\x11\x4e\x53\x11\x05\xe6\xad\x8e\xff\x9c\xdf\x7f\x06\x80\xa1\x05\xa6\x59\x24\x83\xde\xf2\xb8\xba\xbf\xbf\xbb\xf7\x41\x25\x4f\x1e\x88\x42\x89\x20\x66\x23\xd9\x07\xd2\x5b\x1f\xc3\x90\x73\xca\x52\x2d\x37\x7b\x20\x7a\xcb\x63\x18\x31\xa3\x52\x91\xbd\x58\x7c\x0f\x04\x24\x05\xcf\xb2\x1f\x32\xa8\x27\xbb\xb1\x88\x93\x84\x14\x6a\x1f\xc0\x53\x20\x60\x8e\x9f\x2b\xe5\x4a\x84\xe0\x51\x2b\x63\xe4\xe9\x9b\x3e\x30\xfb\x0f\xad\xd8\xf6\x94\x99\x91\xa7\x6d\xb6\x40\x5a\xfd\xbd\x27\xa8\xa7\x6e\xc2\x1a\xe0\xeb\xcd\xed\xd5\x25\xba\xfb\xf6\x35\x0a\xc4\x53\x33\x3d\x9c\xdd\x7c\xfe\x7e\xfe\xe9\xe6\x12\x7d\x39\xbf\x3f\xbf\x8d\x41\x1a\x03\xb7\x89\x2f\x77\x33\x74\x33\x43\x1f\xbe\xcd\xfe\x17\x06\x53\x1b\x7d\x37\x1f\xf8\xf5\xdd\x0c\xcd\x14\x56\x04\xdd\x62\x86\x97\x44\x74\xac\xc0\x91\x67\x05\x1e\x7b\x56\xe0\x68\xc8\x0a\x3c\xf6\x0d\xb3\xcb\xab\x0f\xdf\x3e\x06\x56\x96\x21\x22\xe1\x4c\x91\x67\x85\x70\x9a\x46\xc9\xc0\x31\xd4\x30\x73\x70\x2b\xcc\x96\x51\x40\xa3\xb1\xa7\xfa\xef\xaf\xbe\xdc\xdd\x7f\xfd\xf5\xeb\xfd\xf9\xc5\x55\xc0\xf2\x74\x63\xbd\x96\x8a\xe4\xe8\x9e\x24\xfc\x91\x88\x35\xba\x61\x85\xe0\x4b\x41\xa4\xdc\x71\xee\xbe\xf3\xac\xcc\x49\x68\xd2\xc6\x9b\x93\x36\xf2\x4c\xf7\xd1\xd0\xa4\x8d\xc0\xa6\xbb\xa5\xc1\x2a\xe0\x98\x51\x1c\x81\xed\x76\x87\x94\x92\x8c\xc4\x22\x01\x05\xc3\x21\xe5\x7a\x2c\x23\x91\x80\x66\xba\x43\x2a\xd9\x3e\x58\x40\xfb\xdc\x61\x99\x65\x85\x14\x47\x6a\x45\xcc\x3e\x1d\x85\x09\xb4\xd0\x2d\xe6\xeb\x8b\x20\x39\x7f\x24\x29\x5a\x08\x9e\x6b\xe0\xd7\x97\x58\x64\xdf\x70\xee\x51\xf0\x2b\x52\xf9\x07\x24\x45\x8f\x4e\x76\x38\x91\x88\x71\xa5\x2d\xe8\x00\xbc\xf9\xc8\x35\x7d\xa2\x6a\x65\x86\xc8\xeb\x44\x2f\x3e\xc4\x45\xf5\xe3\xcd\x65\x5f\xb7\x8d\x9f\x7d\xc5\x94\xb1\xa5\xb5\x72\x13\x82\x24\xaa\xbf\x2f\xbc\xd0\x4d\x93\x15\x49\x1e\xf4\x4e\xa8\x1a\x8a\x5a\x23\xd6\x1a\x0e\x6f\xf1\xf4\x0c\x07\xe7\x28\xc7\x6c\xed\x3a\xf3\x35\x4d\xbd\x90\x31\x33\xac\xcc\xeb\x35\x8d\xe6\x24\xc1\xa5\x24\x86\x96\x1c\x3f\xd3\xbc\xcc\x11\x2b\xf3\x39\x11\x88\x2f\xaa\x0e\x91\x5a\x61\x65\xbe\x6e\x7d\x49\x25\x22\xcf\x09\x21\x6d\x45\xde\x8c\xca\x3d\x51\x62\xed\x18\x36\x02\xa2\x19\x2e\xb5\xdf\xa8\xa9\x16\x15\xad\x08\xe7\xdc\x3a\x3d\x52\xe9\x16\x55\xe7\x5d\x4e\x5a\x43\x02\x34\x01\xae\x0c\x65\xb6\x3b\xe3\x0e\x38\x38\x49\xff\x20\x61\xd1\xf0\x44\x41\x37\x75\x1c\x4a\x74\x2e\x04\x5e\xa3\x04\x17\x38\xa1\x6a\x1d\xe0\xf7\x42\x4f\xaa\x19\x45\x69\x77\x80\xaa\x2d\xc2\x2c\x45\x66\x2c\x96\x98\x32\x8f\x21\xdf\x76\x0b\x33\xf4\xbd\x25\x53\x54\x22\xc5\x39\x92\x2b\x2e\x86\xe5\xdc\xb4\x26\x5a\x3e\xed\x7c\xa9\xcd\x8f\x36\xa5\x18\x77\xbe\x9c\x13\xf5\x44\x08\x43\x23\xc3\xc3\x68\x3a\xd5\xfb\xa9\xc0\x89\x22\xc2\x9f\x19\xdf\x22\xdc\xca\xc8\xeb\x4b\xc5\x4a\xc6\xd9\xb2\x57\x6a\x7d\x2e\x36\x3e\x18\xe6\xc2\xc8\x6e\x6b\x15\x1b\xc1\xd8\xc6\x0c\x50\xcc\x36\x66\x25\x2d\x8b\x8c\x26\xc1\xbd\x12\x9d\x77\x94\x0f\x6e\xda\xda\xaf\x71\xa6\x7d\xf1\xb5\x5d\x09\x72\x80\xb5\x94\x2e\x16\x44\x68\x7f\xa1\xc5\xa4\xcf\x00\xd0\x59\xfe\xc6\xac\xab\xd3\x5e\x23\xad\x0e\xb7\x4c\x86\xb6\xe6\x30\x65\x12\x61\x24\x95\xb0\x2a\x0d\x9b\x28\x91\x1e\x6a\x9c\x65\xfc\x29\xa8\x1c\x1a\x95\xe9\x4d\x54\x4e\x88\x92\xde\x9f\x44\x99\x05\x94\x81\x6f\x40\x87\x99\xbc\xaf\x97\xb6\x59\xd3\x46\x7e\xb0\x58\xee\xa4\x08\x2a\xb9\xeb\x7c\x17\x56\x77\x1d\xfd\x5e\x70\x29\x69\x58\x01\xb5\x18\x01\xae\x9d\x00\x23\x32\xc7\x59\xb6\x3b\x23\xaf\x2f\xdd\x0f\x43\x8a\x2c\xa7\xcc\x6c\x07\x7a\x1e\x13\x5f\x8d\x1a\xa5\x20\x34\xdf\x3e\x3f\xc0\xe5\xb3\xc1\x8f\x15\x1a\xba\x0c\x45\xa3\x82\x1c\xbd\xbe\x98\xef\xea\xc5\x6d\x3e\xb6\x0b\x6c\x9e\xf1\xe4\xa1\xab\xee\x1b\x1e\x6f\x58\x51\xaa\x0e\x2f\x8a\xeb\xad\x2d\x2f\x33\x45\x8b\x8c\xe8\xad\xcf\xeb\xa0\x61\x6f\xb2\x9b\xce\xae\x96\x76\x9f\x19\x88\xce\x95\x22\x79\xa1\x34\x11\xa6\x4d\xa3\xc0\xaa\xe5\xd4\xd7\x45\xc3\xd2\x67\xae\x56\x46\xe6\x38\x4a\xb9\x4f\xf1\x6e\xca\xb9\x82\xeb\x37\x5d\xdb\x34\xbb\x56\xfd\x54\xfb\xdd\x40\xe9\x9e\xfa\x8e\x0a\x5b\x70\x9f\xee\x0b\x67\xd8\x58\xff\xa1\x1a\x26\x47\x4f\x2f\xf1\xd6\x54\x76\xdf\xe0\xbe\xaf\x1a\x5a\x5b\x3c\xbb\x8f\x2a\x23\xc6\xac\x7b\xc7\x66\xd7\xb2\xf3\x58\x7a\xe7\x07\x6b\x3a\x71\x9f\x9a\xa7\x6b\x4c\x33\x0d\x65\x4d\xa2\x0a\x2a\x27\x0a\xc7\x98\xd6\xef\xfc\x80\xcd\x30\x2c\x2f\x08\xdb\x1b\xd4\xd3\x03\x5b\x40\x4d\x3c\x7a\x5f\x50\x3f\x80\x33\x0c\xfa\x24\xe8\x0f\x18\x5f\x3f\x52\x1c\x46\xfd\xde\xe0\xbc\xbe\x98\x70\x08\x53\x68\x2e\xf8\x03\x61\x31\xb8\xef\xa1\xe2\x74\x4b\x72\xae\xb7\x28\xab\xcc\x29\x67\xaf\x2f\x0b\x4c\xb3\x52\x84\xd6\x07\x4a\xb0\x74\xeb\x58\xae\x78\x99\xa5\x88\x91\x47\xed\x12\x24\x49\x29\xd0\x11\x5a\x11\x5c\xb4\xba\x42\x9b\x3d\x35\x6b\xe6\x6b\xaf\xe5\xfb\x1e\x2a\x91\x37\xec\x11\x67\x34\x45\x94\xa5\xe4\xb9\x27\x4a\xba\x9d\x64\xf3\xf5\xcf\x6e\x96\x69\xfa\x0b\xa2\xda\x08\x61\x38\xcb\xd6\x68\x29\x30\x73\x2e\x0d\xb5\x60\xc1\x4d\xc3\xb6\x47\x19\x5f\xd2\xe4\xf5\xa5\x4d\x48\x8b\xab\x5d\x45\xde\x8c\xe2\x9b\xd7\x17\x46\x9e\x5e\x5f\x6a\x57\x31\x82\xc1\x6f\xf6\xdc\x43\x71\xb4\xa4\x8f\xa4\xf1\x3a\x0f\x51\x4a\x64\xa1\x45\xbc\x65\x55\x99\x50\x52\x65\xa8\xe5\xf8\x39\x9e\x5f\xe8\x6a\xd3\xfb\xb7\xc4\xd6\x0f\x76\x44\x6c\xd8\xba\x70\x56\xcf\x3d\x47\xbe\xea\x79\xab\x19\x0d\xe3\xea\xc4\xdf\xe1\xb1\x60\xb4\xe5\x73\xd4\x7c\xdd\x95\x4a\x9b\x0b\xbf\x73\x89\x04\x66\x21\xa3\xf2\x1c\x3d\xe2\xac\x24\x28\x23\xd2\x78\xd2\xac\x6b\x5d\x15\xc6\x0f\xd0\x53\xa7\xfb\xb0\x4d\x9f\xb0\xac\x8c\x6c\x90\x89\xd6\x7c\xd9\xf6\xd4\x2b\x33\xbd\xe3\x81\xbe\xf1\x98\x3d\x85\x33\x6b\xdd\x60\x23\x33\x7d\x86\x41\x13\x6a\xd8\x88\x34\x70\x81\x32\x8e\x53\x92\x9a\x59\xe3\xa5\xaa\x0e\xeb\xfb\x8d\x83\x5a\x79\xb8\x1d\xd6\xda\x19\xf6\x33\x9f\x0d\xdf\xc6\xe9\x63\xc3\x05\x69\xaf\x71\x99\x05\x1c\xe8\x8a\x03\x9e\xe7\x7a\xe4\x1a\x4e\x0a\x22\x16\x5c\xe4\x5a\x51\xd8\x39\x9c\x7d\xbd\xfb\x62\x23\xcd\x00\x4d\x7d\xea\x1b\xc5\x7d\xf4\x5d\x72\xe6\x64\xbb\x47\xdb\xcd\xb8\x5e\x3e\xfa\x6f\x12\xe5\x78\xed\x16\x46\x5a\x8a\xda\xed\x10\x3c\x21\x52\xea\x1f\xf9\xa2\x1d\xea\x3a\xb4\xd2\xa0\x97\x4c\x39\x97\xfa\x77\x4c\xe9\xbd\x5e\x58\x45\x9e\xbb\xe9\x7d\xe2\xe2\x01\x3d\x91\x2c\x7b\x13\x72\xdf\x34\x30\x5a\x70\x61\x49\x40\x2b\xcc\xd2\x4c\x43\xe1\x4c\x4f\xec\x72\x85\xa8\xaa\x86\xcd\x52\x66\x78\x29\x25\x11\xc8\x42\x26\x9e\x5d\x74\xec\xc7\xa4\x7b\x87\x47\x53\x6e\x67\x50\x23\xf4\x45\xa7\x7d\xb3\xba\xad\x34\x18\x6f\x75\xb3\xd9\x45\xc3\xea\xac\x6a\x23\x51\x5e\xca\x8d\xc8\xd9\x82\x0b\x67\x6b\x6a\xe6\x9b\x90\x55\x1d\xc3\xbf\xfd\x70\x1f\x3c\x76\xf1\x92\x6f\x46\x63\x2f\x82\x3f\x1e\x8a\xe0\x8f\xa1\x11\xfc\x73\xbb\x47\x6b\x7b\xc3\x6c\xff\xd2\xe6\x10\x45\x58\x1a\x63\x68\x28\x3f\x9f\x0b\x94\x62\x85\x2b\xc3\x55\xcb\x9b\x31\xb1\xa2\x40\x81\x51\xfd\x1a\x14\xa7\xe9\x9e\x88\xc0\xe8\x7e\x81\x05\x55\x6b\xeb\xec\xef\x35\xac\xc0\x08\xbf\x13\xd5\xb2\xa4\xe9\xfe\xa0\xd0\x40\x7b\x4a\x1e\x69\x62\x1d\xf3\x05\x2f\x59\xcc\x11\xc6\x18\x1a\xc5\xee\x0c\xa8\x36\x28\xa3\xc0\x80\x91\x07\x7f\x34\xa3\x11\x81\x91\xb6\x5a\x42\xf7\x1b\x4c\x4f\x5a\xfa\xd1\x1e\xc8\x7a\x3f\x30\x3f\xbe\xd6\x73\x14\xbe\xa9\x65\x62\xc7\xd2\x8f\x83\xf5\x65\x15\x54\x83\x69\x83\xf4\x71\x89\x13\xa3\xb1\x1f\xa7\x1a\xc0\xd3\x5b\x3f\x8e\xce\xd2\x18\x8d\xc7\xd0\xc4\x82\x25\x51\x1d\xf9\x84\x8f\x66\xbd\xf1\x5c\x9a\x75\x0b\xdb\x7a\x26\xde\xd6\x33\x19\xda\x7a\x26\xd0\xad\xe7\xc6\x26\x43\x22\x99\xe0\x18\xcf\x76\x02\xdd\x6f\xee\x49\x34\x02\x70\x73\xf9\x44\xa5\x72\xaa\x30\x0a\x06\xb8\xa3\x18\x18\xac\x2d\xec\xd7\x97\x3d\xd0\x82\xfb\xc9\x7f\x85\xd5\xc4\x35\x65\xa9\xe6\xec\xe7\x92\xa6\xbf\x44\xa1\x81\xb3\xd5\xb4\x4f\x12\xbb\x76\x26\x7e\x06\x67\x0f\x8c\xdb\xb0\x4c\xf0\x2a\x1e\x0d\x9a\x9f\xe6\xd0\x92\x8c\xcb\x78\x2d\x34\x79\xeb\x25\xa7\x0d\x6e\xc6\xaf\x2f\xfd\x4a\x1d\xd9\x85\xdf\x0a\x94\xdb\xc0\x76\x75\x44\xaf\xfd\x4a\xff\xeb\x01\xd2\xbc\x34\xb6\x30\x69\x9f\x39\x33\x10\xc6\x8d\xbd\x0c\xcb\x2e\xba\x63\xd9\x1a\xa5\x44\xe1\x64\x45\xd2\x7a\xec\xac\xab\xea\x08\x04\x90\x04\x4d\xae\x4d\x31\xc9\x39\xb3\x39\xe7\x31\xb3\x02\xcd\xa7\xad\x71\x78\x11\x05\x03\xd4\x41\x6e\xb8\xb0\xd2\xc3\x97\x6b\xa7\x2d\x25\x2a\x32\x09\x7b\x34\xf1\x8d\x96\x21\x54\xad\x8e\x7e\x0c\x2c\xd0\xd6\xb5\x5c\xee\xa1\x72\xfd\x24\xda\x3e\xfe\xf6\x05\xf2\x14\x53\x78\x81\x74\x38\x8a\x57\x15\x7e\xe6\x6c\x9f\xaa\xf8\x31\x70\x40\xcd\x54\xd6\xa1\x47\xb3\xdc\x50\xce\x19\x55\x5c\xd0\xd0\xa1\x3e\xce\xb2\xd6\xdf\xdd\xf2\x91\x08\x8b\xfa\xd8\xe9\xf5\x45\x94\x4c\x7b\xfe\x87\x88\x0b\xed\xa8\xbb\xe6\xb2\x2f\x05\xc7\xa7\x1b\xa8\xb6\xda\x74\xf3\x62\x1b\xd9\xaf\x2f\x3e\xdd\xaf\x2f\x2d\xc2\x4d\x2f\x05\x49\xa3\xe9\x06\x27\xf2\xb6\x94\x4e\x41\x52\x54\x32\xf2\x5c\x98\x55\x99\xad\x7d\xd2\x21\x8d\x07\x68\x82\x26\x78\xda\x2b\x0c\x64\x8f\xc5\xe4\x67\x5d\xf4\x40\x09\x92\x11\x2c\x77\x83\xaa\x6d\x63\x13\xc3\xdc\x92\x50\x39\xf5\x6c\xe2\xf7\x43\x36\xf1\xd4\xb7\x89\xfb\x3c\x25\x13\x40\x75\x67\xa3\x29\xae\x4f\x74\xdf\x44\x8c\xd7\xd4\xb7\x90\x21\xa8\xe6\x44\x76\x2f\x58\xa8\xd7\x64\x61\x7b\x42\xf2\xbb\x00\x42\x3d\x27\x0b\xd8\xcd\xd8\x8b\x43\x84\xde\xfb\xb8\xdc\x3f\x40\x32\x05\xdb\xd0\x6a\x45\x5a\xb9\x79\x52\xa6\x4d\x50\xb2\x4a\xd5\xfa\xf3\x2f\x13\xfd\xfa\xf3\xaf\x28\x42\xa0\x56\x36\x7b\xcc\xab\xbd\x65\x2f\x07\x7c\x0a\xb6\xb4\x67\xd2\xe5\x88\x54\x0c\x2f\x4d\x70\x51\xd8\xf3\x94\x3f\xff\x42\xf3\xb5\x0a\x24\x3e\x42\x48\x80\x5e\x0d\x99\xb5\xc7\xbb\x3e\x73\xd2\x44\xc5\xe1\x42\x6f\x88\xdc\x7e\xb8\x7f\x7d\x31\x07\xe3\xd1\xc3\xec\xdb\xcc\xfd\x58\xee\x38\x3c\x1e\x0b\xaa\x94\xcc\xe9\xcb\x91\xe2\x19\x11\x98\x25\xc4\x68\x56\xb4\x27\x9f\x50\xcd\xf4\x1f\xc1\xd9\xd2\xa3\x20\x27\x6a\xc5\x53\xa4\xd6\x45\xcc\xf6\x35\xf5\x8d\xea\x1e\xf4\x83\x3f\xff\x42\x5f\xb0\x50\xd4\x1c\xb9\xd4\xd7\x9b\x0c\xdb\xfe\xed\x5e\x08\x32\x54\x5d\x35\xc8\x9c\x99\xd3\xb8\x7d\x40\xa1\x6a\xcb\x0c\xf6\xeb\x8b\x55\xce\xe4\xd1\xdc\x23\x8d\x52\x94\xe0\x8b\x6a\xee\x10\xdf\x9e\xf1\xe2\x0c\xe1\x34\x15\x44\xca\x3d\x04\x0b\xaa\x24\xac\x60\x69\x09\x32\xe7\x63\xd8\x6e\x48\x3d\x0e\xf1\xd7\x15\xb1\x4d\x7f\xd6\x6d\xe7\xe5\x62\xa1\x35\xbb\x3d\x59\x4b\xb1\xc2\x47\x52\x71\x81\x97\xe4\x17\x24\x0b\x92\xd0\x05\x25\x29\x9a\xaf\x8d\xee\x69\x77\x5c\x9f\xe8\xe1\x44\x95\x38\xab\x7e\x6b\x7a\x36\x06\x59\x95\x31\x1a\x3a\xcb\x6b\xce\x92\x6d\xfb\xbe\x9c\xbe\xa9\x6f\x9b\x86\x5d\x2a\x73\x18\x58\x99\x66\xa8\x71\x1c\x63\x86\x1d\x9a\x53\xcc\xb4\xe2\xc8\x31\xd5\x4e\x03\x92\xfb\x59\xa1\x53\x68\xee\x2f\xe3\x6e\x16\x8c\x99\x61\xac\xcb\x14\x1d\x28\x2c\x96\x44\xe1\xc6\xc6\xdc\x15\x1d\x78\x9c\xc0\x08\x49\xdd\xb1\xe6\x82\x0a\x69\x6e\x54\x69\xd9\xb1\x81\x94\x3d\xd8\x87\xde\x4a\xf3\xa4\x70\x85\x25\x9a\x6b\x1b\x24\xf2\x6e\xd7\x68\xea\x87\xff\x77\x85\xde\x0c\x23\xed\x02\x0e\x9c\x76\x7b\x7d\xd1\x64\xee\xa4\xa9\x47\x8a\xbf\xc8\x3d\x62\xe3\xf2\xbf\x7d\x7a\x81\x82\xd2\xd0\xeb\x44\x63\x3b\xc9\x5a\x2f\xb5\x89\xed\xde\x94\xa9\x92\xdd\x4d\xc2\x6d\x78\xb5\x0d\x50\x0d\x8d\x00\xb5\x08\xb4\xc1\x81\x24\x23\x58\x44\x4e\x2d\x74\xa7\xea\xce\xed\xd6\xd5\xe4\xa8\x0c\x25\x21\x0c\x10\x03\xdd\xc4\x76\x25\xa6\x64\x0f\x8c\x3f\xb1\xce\xcc\x3d\x99\xed\xa8\x93\xd0\x3f\x40\x19\xd4\x18\xef\x52\x36\x24\xf8\x8d\xd4\x38\xaa\x5a\x3e\xa8\xcb\xa1\x31\x63\x08\xa0\x2e\x90\x0a\x3c\x20\x39\x52\x61\x55\x4a\x54\x16\x69\xe4\xcd\xc5\xe9\x14\xa8\x8c\x6c\x3c\xc1\xdd\xb1\x3d\x43\x57\x66\x33\xf8\xcc\x45\x8e\xb3\x03\xbf\x53\x60\xb4\x37\xd8\xe9\x25\x59\x0a\x9c\x92\x34\xd0\x2d\x30\x9c\x1b\xec\xf6\x96\x9a\x3c\xa1\x40\xaf\xc0\xb5\x1a\xec\xf5\x83\xc9\x68\x0d\x74\x0a\x8c\xcc\x6e\x74\xda\x3b\xa0\xc0\xd2\x1e\x1b\xdd\x0d\x0c\xa5\xb7\x08\x40\x1d\xde\x93\x79\x49\xb3\x34\x3c\x8e\x9e\xf1\x08\xea\x72\xa6\x78\xd1\x29\xe1\xe3\x30\xb6\x1c\xe7\x9e\x78\xa1\xab\x93\xa1\xd0\xd5\x09\xf4\x38\xb7\xe1\xf0\x92\xcc\xcb\x65\xc6\x97\x7e\x57\x40\xe9\x6e\xba\xaa\x82\x92\x7e\x57\x40\x89\x6e\x75\xd5\xa9\x2b\xd0\xea\x69\xf0\x1e\x37\xf2\xbb\x14\xb6\x4b\x54\xdd\xdb\x46\x82\x14\xcd\x9d\xb9\x56\xc7\xe0\x42\x36\xdd\xfe\x22\x94\xd1\x09\xb4\x82\x8d\xf3\x13\x12\x73\x1d\xab\x30\xea\x36\xe3\xc9\x43\x94\x06\x3c\xf1\x83\x33\x20\xd0\xd7\x17\x2a\x51\xc9\xe2\x71\xa1\x27\x7c\xd5\xc0\x26\x3c\x2f\xcc\x6d\x0c\x97\x10\xb5\x28\xb3\x40\x18\x1c\x02\x0c\x0d\x5d\x1c\x54\xd0\x82\xc8\x32\x53\x0d\x29\x2e\x0f\x3e\xc6\xf2\x3f\x81\xa6\x2e\xf5\x82\xbb\xb5\x14\x07\x0e\x75\x3b\x78\x0d\x67\x3d\x9d\xf0\xbe\xdf\xf1\xfe\x6c\x62\xbd\xcd\xa1\xcd\xb8\xbd\xeb\x83\xd9\x1a\x15\x55\x08\x04\x42\x1f\x70\x2f\x62\xdc\x7a\x46\xaa\xa6\xd3\x27\xd0\x96\x86\x70\x24\xa5\x6e\x27\x80\xd0\x00\x35\x23\xaf\x6b\xfb\xc8\x1e\x87\x39\x4a\x0e\xab\xac\x1e\x53\x0a\x8d\x17\x1b\x99\xc3\xb0\xd3\x8b\x0b\xce\x16\x74\x09\xcb\xec\x39\xf5\xb6\x82\xa1\x42\x74\x75\xf3\xad\x83\x9c\x18\x1a\xd0\x82\x9a\x32\x4b\x38\x45\x29\x67\x31\xbe\xe6\x29\x34\xc5\x67\x49\x94\x4b\x6f\x8f\x46\x02\x6e\x4d\x36\x6e\x64\xb1\xe2\xf3\x2b\x4f\xa1\xdb\x57\x1b\x2e\x32\x69\xee\x34\x90\xcb\xd9\x97\x38\x5d\xd5\x54\x73\x13\x68\x22\x3e\xb1\x31\xb1\xd3\x40\x5e\xe7\x36\xdc\x07\xb2\x8e\xc7\x0b\x1c\x8e\x86\x6f\x9a\xb4\xc5\xd3\x24\x02\xc5\x8e\x6c\xa0\xc8\xd1\x56\x44\x77\x25\x35\x9e\x4b\xe8\xfd\xa1\x0e\xe6\x5e\x61\xf3\xd3\x40\xc9\xa3\xed\x23\xbb\x67\x3a\xe4\xe9\x08\x7a\x61\xee\x37\xc9\x19\x4a\x79\x52\x69\x6c\x3e\xff\x8d\x24\x81\x7d\xa7\x12\xb2\x46\x59\xfc\xc3\xae\x2f\x73\x7b\xd2\xfc\xc2\xde\x22\xe9\x0a\xc6\x61\xeb\xcc\x01\xfd\x23\xcc\x56\x50\x13\xdf\xe2\xa2\xd8\x56\x4e\x69\xec\x55\xe6\x19\x1f\x6f\xa8\xe0\xe6\x5c\xda\x26\xd1\xf2\x6d\x5d\x8e\xbc\x2e\x37\xaf\x0a\xd4\x5d\x7e\xbc\x18\xde\x21\xc6\x5e\xee\xe7\x78\x28\xf7\x73\x0c\xce\xfd\xfc\x78\x81\x94\xa0\xcb\x25\x89\x8a\xd8\x8c\xc1\xb9\x9f\x1f\x2f\xe2\x8b\x8a\x8e\xc1\xf9\x9f\x1f\x2f\x5e\x5f\xe2\x36\x9e\x31\x38\xf9\xf3\xe3\x45\x5d\x9d\x25\x32\x65\x6d\x0c\x4e\x8d\xfb\x4e\x13\x45\xf3\xda\x5c\x4f\x38\x93\x4a\x94\x89\x8a\x59\xc8\x63\x70\xa2\xdc\x27\x8e\xb5\xcd\xfa\x48\x84\x24\x28\xc7\x11\xd9\x72\x63\x70\xb6\x9c\xc1\xb2\x9b\xab\xb9\xc7\xbf\x6b\xf1\xad\x5b\xa2\xf0\xf5\xac\xb3\x78\xa6\x9b\x8b\x67\xe2\xad\xed\xc9\xd0\xe2\x99\x04\xaa\x6e\xf5\xa4\xb7\xdc\xda\x7f\x34\xc7\x48\xa9\xf6\xb8\x97\xa1\xbc\xa4\xad\x63\x36\x09\x5c\xac\x0a\x8f\x99\x87\xaa\xb9\xd0\xca\xb0\x6d\xa1\xc3\x71\x47\x81\x0b\x5d\x41\x97\xe2\xa6\x2e\x9a\x8b\x6e\xaf\x67\x9d\xcb\xc2\xbb\xe1\x01\x0f\x8b\x6e\xcd\xa1\xc9\x7e\x50\x40\x57\xed\x9b\xab\x8c\xb0\x1f\x18\xd0\x35\x6b\xbc\x0e\xc2\x7e\x2f\x49\x49\x4c\x9d\xe0\x5c\x06\x92\xd9\x7a\x9b\xea\x5f\xdd\x5e\xcf\x0e\xed\x3d\x40\xe7\x48\x91\xe7\x02\xb3\x14\x2d\x04\xb1\x95\x71\xff\x0d\x21\x1a\x78\x4f\xe5\x82\xe7\x05\x4e\xd4\x40\x75\xcf\x76\x93\x84\x97\x59\xca\xfe\x69\x32\x30\xb4\x42\x46\x69\x69\xb2\xf7\x4c\xb2\x0f\x33\x37\x0f\x0d\x95\xb2\xc0\x80\xd3\x88\x28\x2a\x63\x48\xa8\x01\x03\xd7\xf6\xfa\x12\x31\xae\x67\xda\xde\x89\xae\x1c\x37\x09\x5c\xd7\x1b\x86\xda\xa3\x4c\xdd\x24\x70\x4d\xaf\x0f\x6c\x53\xc9\x44\xda\x8f\x93\xc0\x3d\xbd\xbe\x3a\x9d\x2e\x19\xa0\xc0\x02\xe7\xa4\x55\xee\x69\x37\x38\x68\x8a\x85\x16\x04\x73\xc0\x11\x85\x02\x0d\x31\x54\x87\x28\xf1\x48\xbb\x1f\x43\x35\xd5\xcd\xa3\x00\x77\x3f\x5d\x9a\x9b\x4c\xdb\x32\xc2\x52\x98\x8c\xc1\x69\x5d\x8c\xa3\x9c\xa4\x14\x1b\x69\xbc\xbd\x9e\x45\x81\x41\x73\xb9\x5c\xc1\xa3\x4e\x49\xa9\x39\x8d\xd9\xd6\x03\x57\x38\xb7\x8e\xa7\xf6\x79\xa2\xa0\xa0\xaa\x84\xd6\x95\x3a\xf6\xb1\x1c\x02\x97\x38\xb7\xb2\xe6\xee\x1a\x6b\xd7\x2e\x0a\x11\xaa\x4c\x1a\xc4\x05\x75\x59\x37\xd1\x98\x50\x8d\x52\x81\xd4\x0e\x70\x41\xa2\xea\xb5\x4f\xc6\xe0\x08\xe6\x8f\x64\x13\xaa\x68\x94\xa0\x8d\x98\x36\x4c\xc7\xda\x4d\x63\x70\x95\xf1\x96\x14\x99\x8b\x5c\x7b\x71\x0b\x55\x3b\xad\x11\xb6\x11\x87\xbd\x50\xa1\xfa\xa7\x41\x75\x05\xac\xf6\x41\x05\xdf\x56\x68\x0b\x70\xb5\x71\xc5\x1e\x0f\x4d\xc6\xe0\xd2\xe3\xed\xcc\x17\xbc\x9f\x10\x07\xa2\x72\xdb\x30\x6d\x1a\xad\x2b\xc5\x1b\x8d\x0b\xd5\x4b\x4f\x82\xab\xa6\xc0\x9f\x2d\xea\xa3\xcc\xd1\x8b\xc9\x03\x11\xad\x7d\xc7\xb7\xb0\xf5\xce\x27\x70\x8e\x52\x2a\x1f\x20\x44\x41\x15\x57\x33\x18\x92\x90\x87\xfe\x81\xd8\x99\x00\xa8\x1a\x33\xf3\xfe\x37\x0d\x0a\x54\xcd\xfd\xad\x33\x05\x55\x81\x2e\x91\xb0\xc7\x03\xdb\x15\x15\xaa\x03\xab\xc2\x81\x3f\x0a\x17\xaa\x05\x2b\x93\x6f\x6f\x44\x70\x81\x04\xcf\x50\xc9\x89\xc2\xc8\xa5\xf7\xc6\x28\x06\x70\xa5\x84\xcd\xcd\x6d\x6f\x60\x70\xc9\x84\x16\x50\x25\xe9\xd1\xde\x0a\xb8\x76\x42\x78\xa0\x7b\xea\x40\x42\x80\x77\xd7\x75\xc6\x7c\xd9\x17\x76\x77\x43\xad\x35\xbd\x7b\xe0\x82\x6f\x00\x35\xe1\x0e\x13\xe9\x68\x46\x3c\x0a\x16\xaa\xa7\x70\x96\x73\xa9\xd0\xa2\x0c\xd4\xbc\x85\xe0\x40\x35\x53\x65\xa5\x98\x41\x8d\xb2\x52\xc6\x50\x65\x64\x0a\xc7\x63\x85\x33\xbe\x0c\xd5\x1f\xdc\x01\xd2\x2f\x4b\xdb\xf7\xac\x8e\x0b\xfa\xc5\xbe\xc4\x32\x19\xfb\xf5\x64\x87\xe5\xd3\x6c\x6d\x8f\x58\x50\x5e\x4a\xad\x05\x64\x9c\x63\x38\xd9\xdd\x0c\x93\xf8\x91\x20\xca\x78\x1a\x25\x98\x93\xdd\xf5\x4e\xc1\x0b\xfb\x12\x02\x46\x66\x94\xa3\x60\x77\xd7\x3a\x45\x29\x57\x26\xb1\x26\x1a\x35\x70\xb8\x77\x71\x7f\xf3\xf5\xe6\xe2\xfc\x93\x0f\x7c\xd1\x48\xec\x2e\xb5\x4b\xeb\x03\x96\xd9\x5a\x1e\x99\xab\x40\x9d\x33\x96\x93\xcd\x23\x16\xef\x1e\xee\x64\xfa\x7e\xe0\x88\x25\x70\x0f\xb7\xe7\x88\xc5\xaa\xc8\x5f\x0d\x09\x11\x63\x15\xb8\x51\xd7\x03\x64\x33\xa1\x7e\xc5\x69\x3c\x96\xef\x67\x0d\x3d\xb1\xf3\xab\x7b\xf3\x66\x17\xbc\x7a\x5a\x3e\xf1\xa5\xff\x44\xd0\xe6\x9c\x9c\x78\x73\x32\x74\xec\x35\x0d\xd4\xd2\x0c\x5f\x54\xa0\x99\x22\x02\xc9\x35\x53\xb8\xaf\xcc\x2b\x60\xb4\x4e\xe0\x77\x86\x1c\xa2\x75\x4d\x6d\xc8\xa1\xc0\x6a\x15\x85\x0a\x3c\x11\x6a\x12\xe2\x33\xbe\x3c\x32\x4d\xad\x7f\xa4\x76\x56\xfe\xf5\xa4\xfd\x9b\xcf\xc2\x6f\x3b\x6d\x4c\xdc\x3b\x6f\x31\xbd\x1b\x9a\xb8\x77\xd0\x83\x43\x4d\xbc\xbd\xd6\x57\xf0\x8c\x26\xeb\xce\x0b\x54\x77\x5f\xb0\x5a\x1d\xb1\xc7\x7c\x31\x9c\x8a\x30\xf5\x4e\x53\xa7\x9b\xcf\x8f\x6e\x76\xba\x10\xa6\x7a\xf2\x96\x84\xe8\xa9\xf7\xa2\xd5\xb4\x37\x05\xc3\x75\x3c\xc7\xc9\xc3\xf6\x7e\xbd\x3c\x8c\xe9\xe6\xa3\x4b\x75\xbf\x36\xef\x6f\xb3\xbf\x8d\x0e\x4f\xbd\x11\x38\x1d\x4a\xd7\x3b\x05\xbf\xe2\x34\xfb\x72\x7e\x71\xd5\xfd\x1b\x58\xb2\x4f\x03\x2f\x38\x6d\xdd\x8b\x2a\xbf\xae\x53\xa8\xb5\xe5\x65\xb9\xba\xaf\xa1\x32\xb2\x03\x74\xec\xbe\xf7\x6f\xa3\x63\x45\x97\x2b\xf3\xf6\x26\xe5\xa6\xf4\xe0\x6f\x7c\x8e\x64\x99\xac\x10\x96\x55\xce\x26\x65\x66\x8f\xab\x72\xb7\x29\x5b\x86\x2e\x51\xaa\x8d\x3a\xb5\x18\x3d\xad\x9a\x40\x47\x8b\x07\xa8\x39\xd1\x7a\xec\xa0\x55\x7f\x96\x3c\x93\xa4\xb4\xaf\x25\x98\x0b\xd3\xf5\x5b\xb7\xbd\xc5\x78\x5d\x93\xca\x9c\xad\xef\xc9\xf5\x97\xdc\xdd\x64\x25\x38\x86\x2d\x8e\x80\x79\xb9\xe6\xae\xb1\x4b\x7f\x7d\xb4\x8f\x2c\x9f\xfb\xe4\x0e\xb4\x6a\x41\x02\xf3\xee\xab\x12\x7a\x75\x55\x7e\x1f\xaf\xe0\x32\xd8\xac\xa9\xa3\x77\x74\xbe\xdc\x34\x52\xf4\xca\x0d\xbc\x9d\xbc\xf9\x6c\xde\xe0\xe2\xd5\x1f\x40\x6d\xbc\x6f\x2c\x25\x0b\xca\x48\xda\x49\x90\x6b\xf7\x04\x75\x16\xff\x25\x39\x43\x5f\xd7\x05\xd9\x48\xb5\xdb\xbc\x0d\x5c\x9d\x52\x7d\xe0\xe9\xda\xb4\xf7\x31\xfd\xdb\x58\xbd\x27\x5e\xd5\xbb\x8f\x36\xc3\xce\x98\xc6\x5f\xee\x66\x5e\x97\xc7\xe0\x03\xad\x6f\x0c\x97\x6a\xc5\x05\xfd\x83\xa4\xe8\x9b\x24\xfd\x8c\x9c\xbb\x76\xf6\x7e\xfd\x7f\x13\x9c\x12\x7f\xfc\x8e\xc1\x71\x6c\x33\x1e\x66\x10\x87\xc7\xcf\xb4\xfb\x82\xd7\x46\x9c\x6d\x78\xdf\x47\x05\xc7\x8e\xfe\xe7\xc8\x69\x82\xa3\x9b\xd4\xf1\xb0\x05\xbf\xf3\xc5\xcf\x65\x49\xd3\x5f\xd0\x77\x9c\x95\xfe\x3c\x06\x32\x59\xfa\xee\xd9\x58\x91\x38\x37\xaf\x05\xb9\x9a\xe2\x05\x96\xd2\x6a\xda\xc0\x84\x86\x1e\x08\xef\xab\xac\xe1\x9e\x23\xed\x29\x76\xed\x9e\x9b\xd6\x53\xe8\x7e\x57\x97\x3b\xf9\x72\x37\x33\x94\x58\xfb\xc7\xd4\x27\x9b\x29\x9c\x04\x62\x77\x48\x10\x9b\x8c\x1f\x24\x15\x2c\x7b\x81\xd9\xaf\xe9\xbc\xc5\x99\x2b\x0f\xfe\x2f\x19\xba\xd4\xa0\x65\xd5\x25\xa5\x99\x6e\xc2\x92\xb1\xc3\x73\xae\xf4\x03\x5f\xa0\x8b\x66\x74\x7a\xe8\xfa\x1b\xc6\x0f\x5e\x29\x96\x71\xb5\x32\x4f\xc2\x59\x79\x6a\x5d\x06\xed\xbd\x1f\x85\xf0\xc6\x47\xc6\x52\xae\xdb\xbf\x41\xff\xc1\x54\xd9\x8c\x35\xf5\x4f\x59\x5d\x07\x6a\xce\x9e\x6b\x3a\x43\x0f\x0c\xf6\xd0\xc9\x99\x79\x04\x88\x7e\xe0\xd7\xe6\xb5\x6c\x77\x77\x35\x25\x78\xf3\x86\xd9\x71\xe8\x0d\xb7\x9e\x5e\x13\xfb\x96\x01\x57\xf6\x58\xd5\xde\xa3\xa1\xcd\x8b\x36\x75\x9f\x63\xf8\xe2\xb9\xaf\x1e\x2d\x57\x34\x27\xbc\x54\x9d\x34\x46\xd8\xf6\x35\xf2\xb7\xaf\xd1\xe0\xf6\x35\x7a\x0b\x2e\x7b\x7c\x39\x5c\xf2\xb8\x7d\x43\x58\xb7\x74\x81\xe2\x42\x90\xce\xe3\xeb\x8d\x18\xda\x62\xcd\xd4\xd6\xb4\xaf\x3e\x69\x3a\x31\x45\x37\x58\xf3\x9e\x20\x61\xaa\x79\xaf\xaf\x26\x7f\x07\xdd\xf4\xef\x92\x88\x75\x9c\x72\xba\x61\x8b\xac\x7c\xbe\xfc\x60\x56\x98\x99\x88\x81\x65\x55\x35\xf6\x49\x05\xcb\xec\x57\x9a\x93\x26\xcb\xa9\x8f\xe0\x2a\x1d\x4a\x99\xd6\x44\x50\x9e\x36\xe5\x45\x02\x04\x96\x4e\xb4\xec\xce\x7d\x9c\x1f\x4e\xf3\xc3\x63\xfd\xff\xea\xf0\xdd\xea\xf0\x78\xb4\x3a\x1c\x4d\x56\x87\xef\xd3\xc3\xf1\xdb\xb4\x2d\x7b\x9f\xbf\xdf\x5e\x21\x9c\xe6\x94\x6d\xc9\x41\xf7\x85\x6f\xfc\x76\xd3\xf5\x6b\x0f\x49\xf3\xc1\xf6\x21\x31\x44\x24\x2a\xeb\x1d\x8d\x0b\xcc\xfe\x69\xaf\x0c\xb0\xc7\x9c\xa0\x44\x89\x6c\xd3\x42\xd0\x78\x50\x1f\xe8\x13\x5f\xa2\x02\x2f\xfb\xee\x7f\xb4\xe0\x32\xd7\x32\x00\x06\x75\x74\x2e\x6a\x45\x37\x0c\xe7\xde\x82\x68\x29\x46\xe9\x4d\xd4\xf9\xff\xf3\x44\xfd\xe0\x79\xf8\xb1\xe3\xdc\x3b\x8a\xff\x17\x00\x00\xff\xff\x09\x51\x9c\x27\x4c\x86\x00\x00")

func ResourcesEventsYamlBytes() ([]byte, error) {
	return bindataRead(
		_ResourcesEventsYaml,
		"../resources/events.yaml",
	)
}

func ResourcesEventsYaml() (*asset, error) {
	bytes, err := ResourcesEventsYamlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "../resources/events.yaml", size: 34380, mode: os.FileMode(420), modTime: time.Unix(1601283478, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

// Asset loads and returns the asset for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func Asset(name string) ([]byte, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("Asset %s can't read by error: %v", name, err)
		}
		return a.bytes, nil
	}
	return nil, fmt.Errorf("Asset %s not found", name)
}

// MustAsset is like Asset but panics when Asset would return an error.
// It simplifies safe initialization of global variables.
func MustAsset(name string) []byte {
	a, err := Asset(name)
	if err != nil {
		panic("asset: Asset(" + name + "): " + err.Error())
	}

	return a
}

// AssetInfo loads and returns the asset info for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func AssetInfo(name string) (os.FileInfo, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("AssetInfo %s can't read by error: %v", name, err)
		}
		return a.info, nil
	}
	return nil, fmt.Errorf("AssetInfo %s not found", name)
}

// AssetNames returns the names of the assets.
func AssetNames() []string {
	names := make([]string, 0, len(_bindata))
	for name := range _bindata {
		names = append(names, name)
	}
	return names
}

// _bindata is a table, holding each asset generator, mapped to its name.
var _bindata = map[string]func() (*asset, error){
	"../resources/events.yaml": ResourcesEventsYaml,
}

// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//     data/
//       foo.txt
//       img/
//         a.png
//         b.png
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {
	node := _bintree
	if len(name) != 0 {
		cannonicalName := strings.Replace(name, "\\", "/", -1)
		pathList := strings.Split(cannonicalName, "/")
		for _, p := range pathList {
			node = node.Children[p]
			if node == nil {
				return nil, fmt.Errorf("Asset %s not found", name)
			}
		}
	}
	if node.Func != nil {
		return nil, fmt.Errorf("Asset %s not found", name)
	}
	rv := make([]string, 0, len(node.Children))
	for childName := range node.Children {
		rv = append(rv, childName)
	}
	return rv, nil
}

type bintree struct {
	Func     func() (*asset, error)
	Children map[string]*bintree
}

var _bintree = &bintree{nil, map[string]*bintree{
	"..": &bintree{nil, map[string]*bintree{
		"resources": &bintree{nil, map[string]*bintree{
			"events.yaml": &bintree{ResourcesEventsYaml, map[string]*bintree{}},
		}},
	}},
}}

// RestoreAsset restores an asset under the given directory
func RestoreAsset(dir, name string) error {
	data, err := Asset(name)
	if err != nil {
		return err
	}
	info, err := AssetInfo(name)
	if err != nil {
		return err
	}
	err = os.MkdirAll(_filePath(dir, filepath.Dir(name)), os.FileMode(0755))
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(_filePath(dir, name), data, info.Mode())
	if err != nil {
		return err
	}
	err = os.Chtimes(_filePath(dir, name), info.ModTime(), info.ModTime())
	if err != nil {
		return err
	}
	return nil
}

// RestoreAssets restores an asset under the given directory recursively
func RestoreAssets(dir, name string) error {
	children, err := AssetDir(name)
	// File
	if err != nil {
		return RestoreAsset(dir, name)
	}
	// Dir
	for _, child := range children {
		err = RestoreAssets(dir, filepath.Join(name, child))
		if err != nil {
			return err
		}
	}
	return nil
}

func _filePath(dir, name string) string {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	return filepath.Join(append([]string{dir}, strings.Split(cannonicalName, "/")...)...)
}
