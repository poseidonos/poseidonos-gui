from logging import StreamHandler
from util.db.influx import get_connection
import datetime

DATABASE = 'poseidon'
IP_INDEX = 1
METHOD_INDEX = 2
SCHEME_INDEX = 3
PATH_INDEX = 4
STATUS_INDEX = 5

class InfluxHandler(StreamHandler):

    def __init__(self):
        StreamHandler.__init__(self)
        self.influx_client = get_connection()

    def emit(self, record):
        fields = {
            "value": record.getMessage(),
            "path": record.args[PATH_INDEX],
            "status": record.args[STATUS_INDEX]
        }
        tags = {
            "level": record.levelname,
            "entity": "MTOOL",
            "ip": record.args[IP_INDEX],
            "method": record.args[METHOD_INDEX],
            "scheme": record.args[SCHEME_INDEX]
        }
        data = [{
            "fields": fields,
            "tags": tags,
            "measurement": "mtool_log",
            "time": datetime.datetime.now().isoformat()
        }]
        self.influx_client.write_points(points=data, database="poseidon", retention_policy="autogen", protocol="json")
