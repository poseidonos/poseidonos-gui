# Docker guide
## load unutu image first.
docker load -i image/ubuntu-18.04.img

## build ibofos docker image.
docker build -t initiator:1.0.0 .

## run docker image.
docker run -it --name initiator --cap-add=ALL --privileged --network host -h vm-ibof-target -v /dev:/dev initiator:1.0.0

#docker exec -i -t pos passwd
#docker exec -i -t pos service ssh restart
