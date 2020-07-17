#install docker-compose.
https://docs.docker.com/compose/install/

#docker-compose uses docker-compose.yaml by default. if you want to set specific file, use -f option.

#make containers using docker-compose.
docker-compose up

#run containers in daemon mode.
docker-compose up -d

#use below command to attach container.
docker attach <container_name>

#remove containers.
docker-compose down

#remove images.
docker-compose down --rmi all
