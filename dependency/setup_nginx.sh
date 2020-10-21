#!/bin/bash

SCRIPT_PATH=$(readlink -f $(dirname $0))

$SCRIPT_PATH/dist/nginx_form_conf
sudo mv $SCRIPT_PATH/virtual.conf /etc/nginx/conf.d/

sudo nginx -t
sudo systemctl restart nginx
