#!/bin/bash

python3 nginx_form_conf.py
sudo mv virtual.conf /etc/nginx/conf.d/

sudo nginx -t
sudo systemctl restart nginx