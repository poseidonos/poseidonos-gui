import requests
import json
from bson import json_util
from flask import make_response


def toJson(data):
    return json_util.dumps(data)

grafa_url = "http://localhost:3500"
ds_name = "poseidon"

def set_telemetry_configuration(ip, port):
    try:
        success_res = make_response("success",200)
        prom_url = "http://{ip}:{port}".format(ip=ip, port=port)

        # Checking prometheusDB is running or not
        prom_res = requests.get(
            '{prom_url}/api/v1/status/runtimeinfo'.format(prom_url=prom_url)
        )
        prom_res = json.loads(prom_res.content)

        if prom_res["status"] != "success":
            return make_response("prom DB is not running", 500)

        # Create data source in grafana
        url = '{grafa_url}/api/datasources'.format(grafa_url=grafa_url)
        headers = {
            "Accept": "*/*",
            "Content-Type": "application/json",
        }
        payload = {
            "name": ds_name,
            "type": "prometheus",
            "url": prom_url,
            "access": "proxy",
            "basicAuth": False
        }
        grafa_create_ds_res = requests.post(url, headers=headers, data=toJson(payload))
        grafa_create_ds_res = json.loads(grafa_create_ds_res.content)

        if grafa_create_ds_res["message"] == "Datasource added":
            return success_res

        # Else Get the data source id named $ds_name
        grafa_ds_res = requests.get(url)
        grafa_ds_res = json.loads(grafa_ds_res.content)

        ds_id = -1
        if len(grafa_ds_res):
            for ds in grafa_ds_res:
                if ds["name"] == ds_name and ds["url"] != prom_url:
                        ds_id = ds["id"]
            
        if ds_id == -1:
            return success_res

        # Update data source with the new ip and port
        grafa_update_ds_res = requests.put(
            '{url}/{ds_id}'.format(url=url, ds_id=ds_id), 
            headers=headers, 
            data=toJson(payload)
        )
        grafa_update_ds_res = json.loads(grafa_update_ds_res.content)
        
        if grafa_update_ds_res["message"] == "Datasource updated":
            return success_res
        return grafa_update_ds_res

    except requests.exceptions.HTTPError as errh:
        return make_response("An Http Error occurred:" + repr(errh), 503)
    except requests.exceptions.ConnectionError as errc:
        return make_response("An Error Connecting to the API occurred:" + repr(errc), 521)
    except requests.exceptions.Timeout as errt:
        return make_response("A Timeout Error occurred:" + repr(errt), 524)
    except requests.exceptions.RequestException as err:
        return make_response("An Unknown Error occurred" + repr(err), 520)