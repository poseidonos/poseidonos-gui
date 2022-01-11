#!/bin/bash

make -C . spdkcsi
cp _out/spdkcsi deploy/image/
cd deploy/image
docker build . -t poscsi
