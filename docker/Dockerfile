FROM ubuntu:18.04
LABEL version='1.0.0'

USER root

COPY apt.conf /etc/apt/apt.conf
COPY gitconfig /root/.gitconfig

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git vim
RUN git clone http://hs0112.moon:password@10.227.30.174:7990/scm/ibof/ibofos.git /root/workspace/ibofos/

WORKDIR /root/workspace/ibofos
RUN git checkout devel
WORKDIR script
RUN ./pkgdep.sh
ENTRYPOINT ./build_ibofos.sh
