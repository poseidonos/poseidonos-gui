from util.db.influx import get_connection

influx_client = get_connection()

def log_to_influx(logs):
    data = logs["logs"]
    influx_client.write_points(points=data, database="poseidon", retention_policy="autogen", protocol="json")
    
