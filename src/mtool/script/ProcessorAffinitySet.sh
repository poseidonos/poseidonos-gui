#!/bin/bash

#Find total Sockets, ports and hytper threading count
NoSocket=`lscpu | grep -i -E  "^Socket" |cut -d":" -f2`
CoresPerSock=`lscpu | grep -i -E  "^Core" |cut -d":" -f2`
ThreadPerCore=`lscpu | grep -i -E  "^Thread" |cut -d":" -f2`
#echo $NoSocket
#echo $CoresPerSock
#echo $ThreadPerCore
testThreadsperCore=$(($ThreadPerCore-1))
#echo $testThreadsperCore
CoresSel=""
#if only once physical cpu is present, use the first core 
if [ $NoSocket = 1 ]; then
    CoresSel='0'
    for (( counter=1; counter <=$testThreadsperCore; counter++ )); 
    do
         CoresSel=$CoresSel','$counter
	#echo $CoresSel
    done 	 
else
    #if more than one cpu, use the first core ins second cpu	
    temp=$(($CoresPerSock*$ThreadPerCore-1))
    #echo $temp
    CoresSel=$(($temp+1))
    #echo $CoresSel
    totalend=$(($testThreadsperCore+$CoresSel))
    echo $totalend
    for (( counter=$temp+2; counter<=totalend; counter++ ));
    do
         CoresSel=$CoresSel','$counter
        #echo $CoresSel
    done
fi

echo "Selected Core"
echo $CoresSel
#echo $CoresSel
#sudo service telegraf start
#procID=`pidof telegraf`
#echo "telegraf pid $procID"
#sudo taskset -p -c $CoresSel $procID
#echo "telegraf started"

#sudo service mongod start
#procID=`pidof mongod`
#echo "mongod pid $procID"
#sudo taskset -p -c $CoresSel $procID
#echo " mongod started"

sudo service nginx start
procID=`pidof nginx`
#echo "nginx pid $procID"
for value in $procID
do
    #echo $value
    sudo taskset -p -c $CoresSel $value
done
