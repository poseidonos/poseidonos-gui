FROM ubuntu:18.04
LABEL version='1.0.0'

USER root

COPY apt.conf /etc/apt/apt.conf
COPY gitconfig /root/.gitconfig
COPY dscert.cer /root/dscert.cer
COPY ssh /root/.ssh

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git vim sudo kmod zlib1g-dev
RUN git clone ssh://git@10.227.30.174:7999/ibof/ibofos.git /root/workspace/ibofos/

WORKDIR /root/workspace/ibofos
RUN git checkout devel
WORKDIR script
RUN ./pkgdep.sh
WORKDIR /root/workspace/ibofos
#ENTRYPOINT ./build_ibofos.sh
