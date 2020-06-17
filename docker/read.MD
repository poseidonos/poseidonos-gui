docker load -i ubuntu-18.04.img
docker build -t ibofos:1.0.0 .
docker run -it --cap-add=ALL --privileged -v /sys:/sys -v /dev:/dev ibofos:1.0.0 /bin/bash
