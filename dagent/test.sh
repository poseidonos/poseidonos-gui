#!/bin/bash


for i in {1..10}
do
	echo "Welcome $i times"
   	curl --location --request GET 'http://10.1.11.7:3000/mtool/api/ibofos/v1/device/scan' &
done

echo "Done"
