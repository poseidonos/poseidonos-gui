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
agg_shard_duration= '7d'
influxdb_host = '0.0.0.0'
influxdb_port = 8086

client = InfluxDBClient(host= influxdb_host, port = influxdb_port, use_udp=True)
#client = None


air_cq_name = 'air_cq'
air_cq_select_clause = 'select mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_read$/), mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_write$/), mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_read$/), mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_write$/), mean(/^lat_data_0_tid_arr_[\S]_aid_arr_[\S]_timelag_arr_0_mean$/), mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/), mean(/^lat_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/) into "mtool_db"."agg_rp"."mean_air" from air group by time(1h)'

cpu_cq_name = 'cpu_cq'
cpu_cq_select_clause = 'select mean("usage_user") as "usage_user" into "mtool_db"."agg_rp"."mean_cpu" from cpu group by time(1h)'

power_cq_name = 'power_cq'
power_cq_select_clause = 'select mean("value"), mean("count") into "mtool_db"."agg_rp"."mean_power" from power group by input_power, time(1h)'

def database_existence(dbs):
    """
    tests mtool database creation
    """

    #print("dbs",dbs)
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

    if(len(default_rp)== 0 or default_rp['default'] == False):
        return False

    for rp in rps:
        if(rp['name'] == agg_rp_name):
            agg_rp = rp

    if(len(agg_rp)== 0 or agg_rp['default'] == True):
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
    
    return True


def create_mtool_db1(cli=client,db=db_name,air_cq_select = air_cq_select_clause, cpu_cq_select=cpu_cq_select_clause, power_cq_select=power_cq_select_clause):
    """ 
    create the mtool database with retention policies and continuous queries
    """
    # cli.drop_database(db)
    result = "Success"
    try:
        cli.create_database(db)
        dbs = cli.get_list_database()
        res = database_existence(dbs)
        if(res == False):
            result = "M-Tool DB Creation Failed"
            raise Exception("mtool_db couldn't be created")
        cli.create_retention_policy(default_rp_name, default_rp_duration, '1',database = db, default = True, shard_duration = default_shard_duration)
        cli.create_retention_policy(agg_rp_name, agg_rp_duration, '1',database = db, default = False, shard_duration = agg_shard_duration)
        rps = cli.get_list_retention_policies(db_name)
        res = retention_policy_existence(rps)
        if(res == False):
            result = "Retention Policies Creation Failed"
            raise Exception("M-Tool Retention Policies couldn't be created")

        cli.create_continuous_query(air_cq_name, air_cq_select, db)
        cli.create_continuous_query(cpu_cq_name, cpu_cq_select, db)
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

if __name__== "__main__":
  main()
