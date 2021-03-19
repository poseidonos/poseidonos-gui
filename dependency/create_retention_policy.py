"""
Configuration file to create default retention policies on InfluxDB and Continuous Queries
"""

from influxdb import InfluxDBClient

default_rp_name = 'default_rp'
agg_rp_name = 'agg_rp'
default_rp_duration = '2d'
default_shard_duration = '1d'
db_name = 'poseidon'
agg_rp_duration = '60d'
agg_shard_duration = '7d'
influxdb_host = '0.0.0.0'
influxdb_port = 8086

client = InfluxDBClient(host=influxdb_host, port=influxdb_port, use_udp=True)
#client = None

air_cq_name = 'air_cq_hourly'
air_cq_select_clause = r'select mean(read_iops), mean(write_iops), mean(read_bw), mean(write_bw), mean(read_latency), mean(write_latency) into "poseidon"."agg_rp"."mean_air" from air group by time(1h),vol_id'

cpu_cq_name = 'cpu_cq_hourly'
cpu_cq_select_clause = 'select mean("usage_user") as "usage_user" into "poseidon"."agg_rp"."mean_cpu" from cpu group by time(1h)'

power_cq_name = 'power_cq_hourly'
power_cq_select_clause = 'select mean("value"), mean("count") into "poseidon"."agg_rp"."mean_power" from power group by input_power, time(1h)'

mem_cq_name = 'mem_cq_hourly'
mem_cq_select_clause = 'select mean("used_percent") as "used_percent" into "poseidon"."agg_rp"."mean_mem" from mem group by time(1h)'

net_cq_name = 'net_cq_hourly'
net_cq_select_clause = 'select mean("bytes_recv") as "bytes_recv", mean("bytes_sent") as "bytes_sent", mean("drop_in") as "drop_in", mean("drop_out") as "drop_out", mean("err_in") as "err_in", mean("err_out") as "err_out", mean("packets_recv") as "packets_recv", mean("packets_sent") as "packets_sent" into "poseidon"."agg_rp"."mean_net" from net group by time(1h)'


def database_existence(dbs):
    """
    tests mtool database creation
    """

    # print("dbs",dbs)
    db_list = []
    for db in dbs:
        db_list.append(db.get('name'))

    for name in db_list:
        if(name == db_name):
            return True
    return False

def retention_policy_existence(rps):
    """
    tests RP creation in db
    """
    default_rp = {}
    agg_rp = {}
    for rp in rps:
        if(rp['name'] == default_rp_name):
            default_rp = rp

    if(len(default_rp) == 0 or default_rp['default'] == False):
        return False

    for rp in rps:
        if(rp['name'] == agg_rp_name):
            agg_rp = rp

    if(len(agg_rp) == 0 or agg_rp['default']):
        return False

    return True

def continuous_queries_existence(cqs):
    """
    tests CQs creation in db
    """
    for cq in cqs:
        if(db_name in cq):
            mtool_cqs = cq
    cq_list = mtool_cqs[db_name]
    names_list = []

    for names in cq_list:
        names_list.append(names.get('name'))
    if air_cq_name not in names_list:
        return False
    if cpu_cq_name not in names_list:
        return False
    if mem_cq_name not in names_list:
        return False
    if net_cq_name not in names_list:
        return False

    return True

def create_mtool_db1(
        cli=client,
        db=db_name,
        air_cq_select=air_cq_select_clause,
        cpu_cq_select=cpu_cq_select_clause,
        mem_cq_select=mem_cq_select_clause,
        net_cq_select=net_cq_select_clause,
        power_cq_select=power_cq_select_clause):
    """
    create the mtool database with retention policies and continuous queries
    """
    cli.drop_database(db)
    result = "Success"
    try:
        cli.create_database(db)
        dbs = cli.get_list_database()
        res = database_existence(dbs)
        if(res == False):
            result = "M-Tool DB Creation Failed"
            raise Exception("poseidon database couldn't be created")

        cli.create_retention_policy(
            default_rp_name,
            default_rp_duration,
            '1',
            database=db,
            default=True,
            shard_duration=default_shard_duration)
        cli.create_retention_policy(
            agg_rp_name,
            agg_rp_duration,
            '1',
            database=db,
            default=False,
            shard_duration=agg_shard_duration)
        rps = cli.get_list_retention_policies(db_name)
        res = retention_policy_existence(rps)
        if(res == False):
            result = "Retention Policies Creation Failed"
            raise Exception("M-Tool Retention Policies couldn't be created")

        cli.create_continuous_query(air_cq_name, air_cq_select, db)
        cli.create_continuous_query(cpu_cq_name, cpu_cq_select, db)
        cli.create_continuous_query(mem_cq_name, mem_cq_select, db)
        cli.create_continuous_query(net_cq_name, net_cq_select, db)
        cqs = cli.get_list_continuous_queries()
        res = continuous_queries_existence(cqs)
        if(res == False):
            result = "Continuous Queries Creation Failed"
            raise Exception("M-Tool Continuous Queries couldn't be created")

    except Exception as e:
        print("exception", e)

    finally:
        client.close()
        return result

def main():
    create_mtool_db1()

if __name__ == "__main__":
    main()
