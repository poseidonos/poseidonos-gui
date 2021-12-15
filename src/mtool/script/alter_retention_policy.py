'''
/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 '''
 
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

