sudo service nginx stop
sudo fuser -k 80/tcp
sudo fuser -k 8086/tcp
sudo fuser -k 9092/tcp
sudo fuser -k 5000/tcp
sudo docker network create M9K
sudo docker-compose up --build
