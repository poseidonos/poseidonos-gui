#!/bin/sh

#Backup Date
parent_dir=$(date +%Y-%m-%d)
#Backup Time
backup_dir=$(date +%H:%M:%S)
# "private" is the name of the shared directory by the NFS server node
backup_path=/home/ibof08/mnt/private/$parent_dir/$backup_dir

#UTC backup start time in RFC3339 format. Include all the points in the db starting with this timestamp
start_time=$(date -u -d '1 hour ago' +%Y-%m-%d'T'%H:%M:%S'Z')
#UTC backup end time in RFC3339 format. Exclude all the points after this timestamp
end_time=$(date -u +%Y-%m-%d'T'%H:%M:%S'Z')

#Local timestamps for backup start and end
start_time_local=$(date -d '1 hour ago' +%Y-%m-%d' '%H:%M:%S)
end_time_local=$(date  +%Y-%m-%d' '%H:%M:%S)

# InfluxDB Backup command
# [-portable] Generates backup files in the newer InfluxDB Enterprise-compatible format. 
# Highly recommended for all InfluxDB OSS users

influxd backup -portable -database poseidon -start $start_time -end $end_time -host localhost:8088 $backup_path

cd $backup_path
#Backup file size
backup_size=$(du -sh)

# Restore instructions saved in README file
cat <<EOT >> README
Database Name : poseidon

Measurements        |    Retention Policy
------------------------------------------
air, cpu            |       default_rp
                    |
mean_air, mean_cpu  |       agg_rp
                    |
power, bmc_logs,    |       autogen
rebuilding_status   |




Backup Size : $backup_size
Start Time :  $start_time_local
End Time :    $end_time_local



################################################ Restore Instructions #####################################################

1. Restore poseidon backup to a temporary database
   #influxd restore –portable –db <database_name> -newdb <new_db_name> <path-to-backup>

2. Sideload the data (using a SELECT ... INTO statement) into the existing target database with infinite retention policy 
   i.e. autogen. This database will be already created by the M-Tool for the debug purpose with the name “debug_db”. 
   >select * into debug_db.autogen.<measurement_name> from
    <new_db_name>.<retention_policy>.<measurement_name> group by *

3. Drop the temporary database
   >drop database <new_db_name>

EOT





