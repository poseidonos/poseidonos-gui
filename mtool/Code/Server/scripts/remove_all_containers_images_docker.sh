echo Running Docker Compose Down Command
docker-compose down
echo Stopping all Containers
docker stop $(docker ps -a -q)
echo Removing all Containers
docker rm $(docker ps -a -q)
echo Removing all Images
docker rmi $(docker images -a -q)
echo Listing all Containers. Should be empty
docker ps -a
echo Listing all Images. Should be empty
docker images -a
echo SUCCESS
