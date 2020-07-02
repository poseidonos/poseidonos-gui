#!/bin/bash
#!/bin/bash
currdir=$(readlink -f $(dirname $0))
cd $currdir
cd ..
go mod vendor
go build -mod vendor

