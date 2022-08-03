import requests
import json
from bson import json_util
from flask import make_response


def toJson(data):
    return json_util.dumps(data)


grafana_url = "http://localhost:3500"
data_source_name = "poseidon"

def set_telemetry_configuration(ip, port):
    try:
        success_response = make_response("success",200)
        prometheus_url = "http://{ip}:{port}".format(ip=ip, port=port)

        # Checking PrometheusDB is running or not
        prometheus_response = requests.get(
            '{prometheus_url}/api/v1/status/runtimeinfo'.format(prometheus_url=prometheus_url)
        )
        prometheus_response = json.loads(prometheus_response.content)

        if prometheus_response["status"] != "success":
            return make_response("Prometheus DB is not running", 500)

        # Create data source in grafana
        url = '{grafana_url}/api/datasources'.format(grafana_url=grafana_url)
        headers = {
            "Accept": "*/*",
            "Content-Type": "application/json",
        }
        payload = {
            "name": data_source_name,
            "type": "prometheus",
            "url": prometheus_url,
            "access": "proxy",
            "basicAuth": False
        }
        grafana_create_data_source_response = requests.post(url, headers=headers, data=toJson(payload))
        grafana_create_data_source_response = json.loads(grafana_create_data_source_response.content)

        if grafana_create_data_source_response["message"] == "Datasource added":
            return success_response

        # Else Get the data source id named $data_source_name
        grafana_data_sources_response = requests.get(url)
        grafana_data_sources_response = json.loads(grafana_data_sources_response.content)

        data_source_id = -1
        if len(grafana_data_sources_response):
            for data_source in grafana_data_sources_response:
                if data_source["name"] == data_source_name and data_source["url"] != prometheus_url:
                        data_source_id = data_source["id"]
            
        if data_source_id == -1:
            return success_response

        # Update data source with the new ip and port
        grafana_update_data_source_response = requests.put(
            '{url}/{data_source_id}'.format(url=url, data_source_id=data_source_id), 
            headers=headers, 
            data=toJson(payload)
        )
        grafana_create_data_source_response = json.loads(grafana_update_data_source_response.content)
        
        if grafana_update_data_source_response["message"] == "Datasource updated":
            return success_response
        return grafana_update_data_source_response

    except requests.exceptions.HTTPError as errh:
        return make_response("An Http Error occurred:" + repr(errh), 503)
    except requests.exceptions.ConnectionError as errc:
        return make_response("An Error Connecting to the API occurred:" + repr(errc), 521)
    except requests.exceptions.Timeout as errt:
        return make_response("A Timeout Error occurred:" + repr(errt), 524)
    except requests.exceptions.RequestException as err:
        return make_response("An Unknown Error occurred" + repr(err), 520)