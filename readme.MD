# Management Stack

### Projects (Go)

Folder Structure
```
/bin*           -Excutable Binaray
/src*           -Source files
/tool           -Build related tool
/script*        -The scripts such as install and run
/dependency     -The dependency binary or config
/vendor         -GoLang Vendor
readme.MD       -The project readme file
go.mod*
go.sum*
main.go*        -main.go or one of main package file
build_xxx.sh*   -Build script, It will move to script folder soon
run.sh*         -Run script, It will move to script folder soon

*Required
```

#### D-Agent
The RESTful API Provider of Poseidon system

#### M-Agent
The Data Collector of Poseidon System and POS

#### ClI Client
The Commnad Line Interface to control POS

#### TUI Client (Experimental)
The Text-Based User interface to control or monitor POS

#### A-Module
The Go module for communicating between app and POS

***

### Projects (Others)
#### Dependency
The installation dep and config of management stack 

#### Plugin
The plugins for communicating between POS info and 3rd party management tool

#### Docker (Experimental)
Docker image and dockerfile