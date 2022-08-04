#!/bin/bash

if [ $EUID -ne 0 ]; then
echo "please run as root"
exit
fi

docker pull ghcr.io/poseidonos-gui/golang_dagent
docker pull ghcr.io/poseidonos-gui/golang_magent
docker pull ghcr.io/poseidonos-gui/python_mtool
docker pull ghcr.io/poseidonos-gui/nginx_ui
docker pull ghcr.io/poseidonos-gui/influxdb_m9k

docker tag ghcr.io/poseidonos-gui/golang_dagent golang_dagent
docker tag ghcr.io/poseidonos-gui/golang_magent golang_magent
docker tag ghcr.io/poseidonos-gui/python_mtool python_mtool
docker tag ghcr.io/poseidonos-gui/nginx_ui nginx_ui
docker tag ghcr.io/poseidonos-gui/influxdb_m9k influxdb_m9k

docker image rm ghcr.io/poseidonos-gui/golang_dagent
docker image rm ghcr.io/poseidonos-gui/golang_magent
docker image rm ghcr.io/poseidonos-gui/python_mtool
docker image rm ghcr.io/poseidonos-gui/nginx_ui
docker image rm ghcr.io/poseidonos-gui/influxdb_m9k
