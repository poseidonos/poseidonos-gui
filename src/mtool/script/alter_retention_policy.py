"""
Configuration file to alter retention policy on M-Tool db for air and cpu measurements

Minimum RP duration = 1h
For infinite RP duration, use 'INF'for default_rp_duration
For RP < 2days, shard duration = 1h
For RP>=2days and <=6months, shard duration = 1day
For RP>6months, shard duration = 7 days
"""

from influxdb import InfluxDBClient

default_rp_name = 'default_rp'
default_rp_duration = '2d'
default_shard_duration = '1d'
db_name = 'poseidon'
influxdb_host = '0.0.0.0'
influxdb_port = 8086

client = InfluxDBClient(host=influxdb_host,port = influxdb_port, use_udp=True)

def alter_rp_mtool_db():
    """
    alter the default Retention Policy on M-Tool DB 
    """
    try:
        client.alter_retention_policy(default_rp_name, database=db_name, duration=default_rp_duration, replication=1, default=True, shard_duration=default_shard_duration)
    except Exception as e:
        print("exception", e)
    finally:
        client.close()

def main():
    alter_rp_mtool_db()

if __name__== "__main__":
    main()

