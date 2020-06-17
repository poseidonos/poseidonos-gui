FROM ubuntu:18.04
LABEL version='1.0.0'
ENV DEBIAN_FRONTEND noninteractive

USER root

COPY ssh /root/.ssh
COPY dscert.cer /root
COPY setenv.sh /root
COPY sources.list /etc/apt
COPY kernel_source /usr/src

RUN apt-get update
RUN apt-get install -y ca-certificates
RUN /root/setenv.sh

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git vim sudo kmod zlib1g-dev

RUN git clone ssh://git@10.227.30.174:7999/ibof/ibofos.git /root/workspace/ibofos/

WORKDIR /root/workspace/ibofos/script
RUN git checkout devel
RUN ./pkgdep.sh
RUN ./build_ibofos.sh

WORKDIR ../
