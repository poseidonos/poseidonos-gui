#Remove previous GrafanaDB
while true; do
    read -p "Do you wish to reset GrafanaDB before installing grafana?" yn
    case $yn in
        [Yy]* ) rm /var/lib/grafana/grafana.db; break;;
        [Nn]* ) break;;
        * ) echo "Please answer yes or no.";;
    esac
done
echo -----------------------Installing Grafana--------------------------------
#Remove previos Default Init
rm /etc/grafana/grafana.ini
#Add dependencies
sudo apt-get install -y adduser libfontconfig1
#Download binary
wget https://dl.grafana.com/oss/release/grafana_9.0.4_amd64.deb
sudo dpkg -i grafana_9.0.4_amd64.deb
#Remove binary
rm -r grafana_9.0.4_amd64.deb*
#Change port to 3500
sed -i "s/;http_port = 3000/http_port = 3500/g" /etc/grafana/grafana.ini
#Enable Annonymous authentication
perl -0777 -i.original -pe "s/# enable anonymous access\n;enabled = false/# enable anonymous access\nenabled = true/igs" /etc/grafana/grafana.ini
#Role of Unauthenticated user
sed -i "s/;org_role = Viewer/org_role = Admin/g" /etc/grafana/grafana.ini
#Allow Embeding
sed -i "s/;allow_embedding = false/allow_embedding = true/g" /etc/grafana/grafana.ini
#Restart server
sudo systemctl restart grafana-server
echo ---------------------Grafana installation done!----------------------------
