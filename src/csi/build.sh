#!/bin/bash

make -C . poscsi
cp _out/poscsi deploy/image/
cd deploy/image
docker build . -t poscsi
