# Docker guide
## load unutu image first.
docker load -i image/ubuntu-18.04.img

## build ibofos docker image.
docker build -t pos:1.0.0 .

## run docker image.
docker run -it --name pos --cap-add=ALL --privileged --network host -h vm-ibof-target -v /sys:/sys -v /dev:/dev -v /usr/src:/usr/src -v /lib/modules:/lib/modules pos:1.0.0
