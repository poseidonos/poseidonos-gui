# SPDX-License-Identifier: Apache-2.0
# Copyright (c) Arm Limited and Contributors
# Copyright (c) Intel Corporation
#
# XXX: pin alpine to 3.8 with e2fsprogs-1.44
# e2fsprogs-1.45+ crashes my test vm when running mkfs.ext4
FROM alpine:3.8
LABEL maintainers="POS-CSI Authors"
LABEL description="POS-CSI Plugin"

COPY poscsi /usr/local/bin/poscsi

RUN apk add nvme-cli open-iscsi e2fsprogs xfsprogs blkid

ENTRYPOINT ["/usr/local/bin/poscsi"]
