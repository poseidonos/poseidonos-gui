PID=`pgrep ibofos`
kill -9 $PID > /dev/null 2>&1
sleep 1
cd /usr/local/dagent/script/
./run_os.sh
sleep 4
cd /root/workspace/ibofos/bin
./cli request scan_dev
./cli request load_array
./cli request delete_array

