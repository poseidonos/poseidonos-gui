# Initiator docker image

FROM ubuntu:18.04
LABEL version='1.0.0'
ENV DEBIAN_FRONTEND noninteractive

USER root

COPY etc /root/etc
COPY script /root/script
COPY etc/sources.list /etc/apt

RUN apt-get update
RUN apt-get install -y ca-certificates
RUN /root/script/setenv.sh

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git vim sudo kmod zlib1g-dev net-tools systemd openssh-server

RUN mkdir -p /run/sshd

RUN sed -i 's/#Port 22/Port 2224/' etc/ssh/sshd_config
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' etc/ssh/sshd_config

RUN tar -xvf /root/etc/go1.14.4.linux-amd64.tar.gz -C /root/etc
ENV GOROOT /root/etc/go
ENV GOPATH /root
ENV PATH $GOPATH/bin:$GOROOT/bin:$PATH

WORKDIR /root

ENTRYPOINT service ssh restart && /bin/bash
