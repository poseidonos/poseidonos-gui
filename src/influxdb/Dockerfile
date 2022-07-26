FROM influxdb:1.7.10-alpine

WORKDIR /

COPY init_influxdb.iql /docker-entrypoint-initdb.d/init.iql

EXPOSE 8086

ENTRYPOINT ["/entrypoint.sh", "influxd"]
