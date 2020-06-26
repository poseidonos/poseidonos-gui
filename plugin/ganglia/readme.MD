# Poseidon Ganglia Plugin

This program collects the following metrics from Poseidon and provides it to Ganglia


    1. Total Size - Total size available for volume creation

    2. Used Size - Size used by volumes

## Adding the Plugin

Follow the below steps on a system with Ganglia already installed:


    1. Move the poseidon.py file to /usr/lib{64}/ganglia/python_modules

    2. Move the poseidon.pyconf file to /etc/ganglia/conf.d/

    3. Restart gmond using `sudo service ganglia-monitor restart`
