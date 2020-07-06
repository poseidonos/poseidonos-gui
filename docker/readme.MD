# Docker guide
## load unutu image first.
docker load -i ubuntu-18.04.img

## build ibofos docker image.
docker build -t ibofos:1.0.0 .

## run docker image.
docker run -it --cap-add=ALL --privileged --network host -v /sys:/sys -v /dev:/dev ibofos:1.0.0 /bin/bash
