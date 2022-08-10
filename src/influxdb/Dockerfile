FROM influxdb:1.7.10-alpine
LABEL org.opencontainers.image.source https://github.com/poseidonos/poseidonos-gui

WORKDIR /

COPY init_influxdb.iql /docker-entrypoint-initdb.d/init.iql

EXPOSE 8086

ENTRYPOINT ["/entrypoint.sh", "influxd"]
