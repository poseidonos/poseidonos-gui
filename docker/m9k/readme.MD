# Docker guide
## load unutu image first.
docker load -i image/ubuntu-18.04.img

## build ibofos docker image.
docker build -t m9k:1.0.0 .

## run docker image.
docker run -it --name m9k --cap-add=ALL --privileged --network host -h vm-ibof-target m9k:1.0.0
