#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

# Removing the default config file in order to avoid conflict on ubuntu system
# Execute the following command if you want to restore the default config file:
# ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

if [ -e "/etc/nginx/sites-enabled/default" ]; then
   rm /etc/nginx/sites-enabled/default
fi

sudo cp $SCRIPT_PATH/virtual.conf /etc/nginx/conf.d/

sudo nginx -t
sudo systemctl restart nginx
~
~
~

