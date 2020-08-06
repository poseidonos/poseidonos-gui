echo -----------------------Installing Docker Compose ---------------------------------
#Install Curl
sudo apt install -y curl
#Install latest docker compose version
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
#make the binary executable and give permissions
sudo chmod +x /usr/local/bin/docker-compose
#Confirm docker compose version
docker-compose --version
#Installing using pip3
pip3 install docker-compose

echo -----------------------Installing Docker Community Edition ---------------------------------
#Step 1: Update System
sudo apt -y update
#Remove Old Versions of Docker
sudo apt remove docker docker-engine docker.io containerd runc
#Install basic dependencies and ca-certificates
sudo apt -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
#Install Latest Docker GPG Key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
#Add docker repository to apt
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
#Update the system
sudo apt -y update
#Install latest version of docker CE 
sudo apt -y install docker-ce docker-ce-cli containerd.io
#Add groups and users (Current User - You may need to login/logout again for its effect)
sudo usermod -aG docker $USER
newgrp docker
#Check Docker Version
docker version
