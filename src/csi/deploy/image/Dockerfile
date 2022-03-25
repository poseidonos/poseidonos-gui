FROM alpine:3.8
LABEL maintainers="POS-CSI Authors"
LABEL description="POS-CSI Plugin"

COPY poscsi /usr/local/bin/poscsi

RUN apk add nvme-cli open-iscsi e2fsprogs xfsprogs blkid

ENTRYPOINT ["/usr/local/bin/poscsi"]
