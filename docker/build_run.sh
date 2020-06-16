docker build -t ibofos:1.0.0 .
docker run -it --cap-add=ALL --privileged -v /usr/src:/usr/src -v /lib/modules:/lib/modules -v /sys:/sys -v /dev:/dev ibofos:1.0.0 /bin/bash
