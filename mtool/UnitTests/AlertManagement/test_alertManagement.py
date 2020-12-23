import pytest
# sys.path.append(os.path.abspath('/usr/local/lib/python3.8/dist-packages/'))
# sys.path.append(os.path.abspath('/usr/local/lib/python3.6/dist-packages/'))
# sys.path.append(os.path.abspath('/home/ibof08/Palak/ibofmgmt/Code/Server/'))
from rest.app import app
from flask import json
from unittest import mock
import requests_mock
from rest.rest_api.alerts.system_alerts import KAPACITOR_URL
from util.macros.influxdb_config import mtool_db, infinite_rp, default_rp

token = ""
INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'
smtp_server = "112.107.220.150"
smtp_server_ip = "112.107.220.150:25"
smtp_server_port = "25"
alertCluster = "cpu"
alertSubCluster = "cpu"
alertType = "cpu-total"
alertName = "TESTNEWALERT6"
description = "description"
chronograf = 'chronograf'
alertRange = "80"
opertorMAP = {
    'Greater Than': '>', 'Less Than': '<',
    'Equal To': '==', 'Not Equal To': '!=',
    'Equal To Or Greater': '>=',
    'Equal To Or Less Than': '<=',
    'Inside Range': 'check', ''
    'Outside Range': 'check'
}
alertCondition = "Less Than"
alertFields = {'cpu' : "usage_user", 'mem' : 'used_percent'}
alertField = alertFields[alertCluster]
payload = {
        "id": '{}'.format(alertName),
        "type": "stream",
        "dbrps": [
            {
                "db": mtool_db,
                "rp": default_rp}],
        "status": "enabled",
        "script": "var db = '{}'\nvar rp = '{}'\nvar measurement = '{}'\nvar groupBy = []\nvar whereFilter = "
        "lambda: (\"{}\" == '{}')\nvar name = '{}'\nvar idVar = name\nvar message = '{}'\n\nvar"
        " idTag = 'alertID'\n\nvar details = 'The system {} usage is {{{{ index .Fields \"value\" | printf \"%0.2f\" }}}}%'\n\nvar levelTag = 'level'\n\nvar messageField = 'message'\n\n"
        "var durationField = 'duration'\n\nvar outputDB = '{}'\n\nvar outputRP = '{}'"
        "\n\nvar outputMeasurement = 'alerts'\n\nvar triggerType = 'threshold'\n\nvar crit = {}\n\n"
        "var data = stream\n    |from()\n        .database(db)\n        .retentionPolicy(rp)\n "
        "       .measurement(measurement)\n        .groupBy(groupBy)\n   "
        " |eval(lambda: \"{}\")\n        .as('value')\n\nvar trigger = data\n    |alert()\n  "
        "      .crit(lambda: \"value\" {} crit)\n        .message(message)\n        .id(idVar)\n   "
        "     .idTag(idTag)\n        .levelTag(levelTag)\n        .messageField(messageField)\n       "
        " .durationField(durationField)\n .details(details)\n .email()\n  .stateChangesOnly()\n\ntrigger\n    |eval(lambda: float(\"value\"))\n "
        "       .as('value')\n        .keep()\n    |influxDBOut()\n        .create()\n        .database(outputDB)\n"
        "        .retentionPolicy(outputRP)\n        .measurement(outputMeasurement)\n        .tag('alertName', name)\n "
        "       .tag('triggerType', triggerType)\n\ntrigger\n    |httpOut('output')\n".format(
            mtool_db,
            default_rp,
            alertCluster,
            alertSubCluster,
            alertType,
            alertName,
            description,
            alertCluster,
            chronograf,
            infinite_rp,
            alertRange,
            alertField,
            opertorMAP[alertCondition])}

@pytest.fixture(scope='module')
@mock.patch("rest.app.connection_factory.match_username_from_db",
            return_value="admin", autospec=True)
def global_data(mock_match_username_from_db):
    login_response = app.test_client().post(
        '/api/v1.0/login/',
        data=json.dumps({'username': "admin", 'password': "admin"}),
        content_type='application/json',
    )
    login_data = json.loads(login_response.get_data(as_text=True))
    return {'token': login_data['token']}


@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_alert_query", autospec=True)
def test_add_new_alert(mock_execute_alert_query, global_data, **kwargs):
#def test_add_new_alert(global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(KAPACITOR_URL + "/tasks", json=payload, status_code=200)
    #mock_sql.return_value.execute.return_value.fetchone.return_value = ('Ladl',)
    response = app.test_client().post('/api/v1.0/add_alert/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT6",
                                                       "alertField": "usage_system",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu ",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Less Than",
                                                       "alertRange": "80",
                                                       "description": ""}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_alert_query", autospec=True)
def test_add_new_alert_failure(mock_execute_alert_query, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(KAPACITOR_URL + "/tasks", json=payload, status_code=500)
    response = app.test_client().post('/api/v1.0/add_alert/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT6",
                                                       "alertField": "usage_system",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu ",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Less Than",
                                                       "alertRange": "80",
                                                       "description": ""}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 500
    kwargs["mock"].post(KAPACITOR_URL + "/tasks", json=None, status_code=500)
    response = app.test_client().post('/api/v1.0/add_alert/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT6",
                                                       "alertField": "usage_system",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu ",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Less Than",
                                                       "alertRange": "80",
                                                       "description": ""}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_alert_query", autospec=True)
def test_add_new_alert_failure_2(mock_execute_alert_query, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].post(KAPACITOR_URL + "/tasks", json={})
    response = app.test_client().post('/api/v1.0/add_alert/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT6",
                                                       "alertField": "usage_system",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu ",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Less Than",
                                                       "alertRange": "80",
                                                       "description": ""}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 200

@mock.patch("rest.app.connection_factory.get_alerts_from_db",
            return_value=[], autospec=True)
def test_get_alerts(mock_get_alerts_from_db, global_data):
    #print("token val",token)
    response = app.test_client().get(
        '/api/v1.0/get_alerts/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    print("DATAAA", data, len(data))
    assert len(data) >= 0

@requests_mock.Mocker(kw="mock")
#@mock.patch("rest.app.connection_factory.delete_alerts_in_db",
#            return_value={"description": "Alert Deleted Successfully"}, autospec=True)
@mock.patch("rest.app.connection_factory.execute_delete_alerts_query", return_value=True, autospec=True)
def test_delete_new_alert(mock_execute_delete_alerts_query, global_data, **kwargs):
    kwargs["mock"].delete(KAPACITOR_URL + "/tasks/TESTNEWALERT_1", json={}, status_code=200)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post(
        '/api/v1.0/delete_alerts/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"ids": ["TESTNEWALERT_1"]}),
        content_type='application/json',
    )
    data = response.get_data(as_text=True)
    assert response.status_code == 200
    print("DATAAA", data)

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_delete_alerts_query", return_value=True, autospec=True)
def test_delete_new_alert_failure(mock_execute_delete_alerts_query, global_data, **kwargs):
    kwargs["mock"].delete(KAPACITOR_URL + "/tasks/TESTNEWALERT_1", json={}, status_code=500)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post(
        '/api/v1.0/delete_alerts/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"ids": ["TESTNEWALERT_1"]}),
        content_type='application/json',
    )
    #data = response.get_data(as_text=True)
    assert response.status_code == 500

    kwargs["mock"].delete(KAPACITOR_URL + "/tasks/TESTNEWALERT_1", json=None, status_code=500)
    response = app.test_client().post(
        '/api/v1.0/delete_alerts/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"ids": ["TESTNEWALERT_1"]}),
        content_type='application/json',
    )
    #data = response.get_data(as_text=True)
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_toggle_alert_status_update_query", return_value=True, autospec=True)
@mock.patch("rest.app.connection_factory.execute_toggle_alert_status_select_query", return_value=None, autospec=True)
def test_toggle_alert_status_failure(mock_execute_toggle_alert_status_update_query, mock_execute_toggle_alert_status_select_query, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].patch(KAPACITOR_URL + "/tasks/TESTNEWALERT1", json={"status": False}, status_code=500)
    response = app.test_client().post(
        '/api/v1.0/toggle_alert_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"alertName": "TESTNEWALERT1", 'status':True}),
        content_type='application/json',
    )

    assert response.status_code ==500

    kwargs["mock"].patch(KAPACITOR_URL + "/tasks/TESTNEWALERT1", json=None, status_code=500)
    response = app.test_client().post(
        '/api/v1.0/toggle_alert_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"alertName": "TESTNEWALERT1", 'status':True}),
        content_type='application/json',
    )

    assert response.status_code ==500

@requests_mock.Mocker(kw="mock")
#@mock.patch("rest.app.connection_factory.toggle_alert_status_in_db",
#            return_value=True, autospec=True)
@mock.patch("rest.app.connection_factory.execute_toggle_alert_status_update_query", return_value=True, autospec=True)
@mock.patch("rest.app.connection_factory.execute_toggle_alert_status_select_query", return_value=['abc@abc.com'], autospec=True)
def test_toggle_alert_status(mock_execute_toggle_alert_status_update_query, mock_execute_toggle_alert_status_select_query, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].patch(KAPACITOR_URL + "/tasks/TESTNEWALERT1", json={"status": True}, status_code=200)
    response = app.test_client().post(
        '/api/v1.0/toggle_alert_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"alertName": "TESTNEWALERT1", 'status':True}),
        content_type='application/json',
    )
    assert response.status_code == 200

#@mock.patch("rest.app.connection_factory.toggle_alert_status_in_db", return_value=False, autospec=True)
#@mock.patch("rest.app.toggle_in_kapacitor", return_value={'status_code':200}, autospec=True)
@mock.patch("rest.app.connection_factory.execute_toggle_alert_status_select_query", return_value=None, autospec=True)
def test_toggle_alert_status_db_failure(mock_execute_toggle_alert_status_select_query, global_data):
    response = app.test_client().post(
        '/api/v1.0/toggle_alert_status/',
        headers={'x-access-token': global_data['token'], 'Accept': 'application/json', },
        data=json.dumps({"alertName": "new", 'status':True}),
        content_type='application/json',
    )
    print("response.status_code ",response.status_code)
    assert response.status_code == 500

def test_get_alert_types(global_data):
    response = app.test_client().get(
        '/api/v1.0/get_alert_types/',
        headers={
            'x-access-token': global_data['token'],
            'Accept': 'application/json',
        },
        content_type='application/json',
    )
    print("OK")
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert len(data['alert_types']) >= 0

# @mock.patch("rest.app.connection_factory.update_alerts_in_db", return_value=False, autospec=True)

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_select_alert_query", return_value=['abc@abc.com'], autospec=True)
@mock.patch("rest.app.connection_factory.execute_update_alert_query", return_value=True, autospec=True)
def test_update_alerts(mock_execute_select_alert_query, mock_execute_delete_alerts_query, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].patch(KAPACITOR_URL + "/tasks/TESTNEWALERT1", json=payload, status_code=200)
    response = app.test_client().post('/api/v1.0/update_alerts/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT1",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Not Equal To",
                                                       "alertField": "usage_system",
                                                       "description": "TEST1Samsple",
                                                       "alertRange": "67",
                                                       }),
                                      content_type='application/json',
                                      )
    data = response.get_data(as_text=True)
    #assert response.status_code == 200
    print("DATAAA", data)

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_select_alert_query", return_value=['abc@abc.com'], autospec=True)
@mock.patch("rest.app.connection_factory.execute_update_alert_query", return_value=True, autospec=True)
def test_update_alerts_failure(mock_execute_select_alert_query, mock_execute_delete_alerts_query, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].patch(KAPACITOR_URL + "/tasks/TESTNEWALERT1", json=payload, status_code=500)
    response = app.test_client().post('/api/v1.0/update_alerts/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT1",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Not Equal To",
                                                       "alertField": "usage_system",
                                                       "description": "TEST1Samsple",
                                                       "alertRange": "67",
                                                       }),
                                      content_type='application/json',
                                      )
    #data = response.get_data(as_text=True)
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
@mock.patch("rest.app.connection_factory.execute_select_alert_query", return_value=['abc@abc.com'], autospec=True)
@mock.patch("rest.app.connection_factory.execute_update_alert_query", return_value=True, autospec=True)
def test_update_alerts_failure_2(mock_execute_select_alert_query, mock_execute_delete_alerts_query, global_data, **kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].patch(KAPACITOR_URL + "/tasks/TESTNEWALERT1", json=payload)
    response = app.test_client().post('/api/v1.0/update_alerts/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT1",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Not Equal To",
                                                       "alertField": "usage_system",
                                                       "description": "TEST1Samsple",
                                                       "alertRange": "67",
                                                       }),
                                      content_type='application/json',
                                      )
    #data = response.get_data(as_text=True)
    assert response.status_code == 200

    kwargs["mock"].patch(KAPACITOR_URL + "/tasks/TESTNEWALERT1", json=None)
    response = app.test_client().post('/api/v1.0/update_alerts/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               },
                                      data=json.dumps({"alertName": "TESTNEWALERT1",
                                                       "alertCluster": "cpu",
                                                       "alertSubCluster": "cpu",
                                                       "alertType": "cpu-total",
                                                       "alertCondition": "Not Equal To",
                                                       "alertField": "usage_system",
                                                       "description": "TEST1Samsple",
                                                       "alertRange": "67",
                                                       }),
                                      content_type='application/json',
                                      )
    #data = response.get_data(as_text=True)
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
def test_Test_smtp_server(global_data, **kwargs):
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={'set': {'enabled': True, 'host': '112.107.220.150', 'port': '25', 'from': 'vishal.s7@samsung.com', 'username': 'test', 'password': 'test'}}, status_code=200)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post('/api/v1.0/test_smtpserver/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               }, data=json.dumps({"smtpserver": smtp_server, "smtpserverip": smtp_server_ip, "smtpserverport": smtp_server_port, "smtpusername": "test", "smtppassword": "test", "smtpfromemail": "vishal.s7@samsung.com"}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
def test_Test_smtp_server_failure(global_data, **kwargs):
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={'set': {'enabled': True, 'host': '112.107.220.150', 'port': '25', 'from': 'vishal.s7@samsung.com', 'username': 'test', 'password': 'test'}}, status_code=500)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post('/api/v1.0/test_smtpserver/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               }, data=json.dumps({"smtpserver": smtp_server, "smtpserverip": smtp_server_ip, "smtpserverport": smtp_server_port, "smtpusername": "test","smtpfromemail": "vishal.s7@samsung.com"}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
def test_Test_smtp_server_failure_2(global_data, **kwargs):
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={'set': {'enabled': True, 'host': '112.107.220.150', 'port': '25', 'from': 'vishal.s7@samsung.com', 'username': 'test', 'password': 'test'}})
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post('/api/v1.0/test_smtpserver/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               }, data=json.dumps({"smtpserver": smtp_server, "smtpserverip": smtp_server_ip, "smtpserverport": smtp_server_port, "smtpfromemail": "vishal.s7@samsung.com"}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
def test_delete_smtp_server(global_data, **kwargs):
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={"delete": ["enabled","host","port","from","username","password"]}, status_code=200)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post('/api/v1.0/delete_smtp_details/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               }, data=json.dumps({}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_delete_smtp_server_failure(global_data, **kwargs):
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={"delete": ["enabled","host","port","from","username","password"]}, status_code=500)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post('/api/v1.0/delete_smtp_details/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               }, data=json.dumps({}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
def test_delete_smtp_server_failure_2(global_data, **kwargs):
    kwargs["mock"].post("http://localhost:9092/kapacitor/v1/config/smtp/", json={"delete": ["enabled","host","port","from","username","password"]})
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().post('/api/v1.0/delete_smtp_details/',
                                      headers={'x-access-token': global_data['token'],
                                               'Accept': 'application/json',
                                               }, data=json.dumps({}),
                                      content_type='application/json',
                                      )
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_smtp_details(global_data, **kwargs):
    kwargs["mock"].get("http://localhost:9092/kapacitor/v1/config/smtp/", json={'link': {'rel': 'self', 'href': '/kapacitor/v1/config/smtp/'}, 'options': {'enabled': True, 'from': 'vishal.s7@samsung.com', 'global': False, 'host': '112.107.220.150', 'idle-timeout': '30s', 'no-verify': False, 'password': True, 'port': 25, 'state-changes-only': False, 'to': ['palak.k2@samsung.com'], 'username': 'test'}, 'redacted': ['password']}, status_code=200)

    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get('/api/v1.0/get_smtp_details/',
                                      headers={'x-access-token': global_data['token']})
    #data = response.get_data(as_text=True)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_smtp_details_failure(global_data, **kwargs):
    kwargs["mock"].get("http://localhost:9092/kapacitor/v1/config/smtp/", json={'link': {'rel': 'self', 'href': '/kapacitor/v1/config/smtp/'}, 'options': {'enabled': True, 'from': 'vishal.s7@samsung.com', 'global': False, 'host': '112.107.220.150', 'idle-timeout': '30s', 'no-verify': False, 'password': True, 'port': 25, 'state-changes-only': False, 'to': ['palak.k2@samsung.com'], 'username': 'test'}, 'redacted': ['password']}, status_code=500)

    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get('/api/v1.0/get_smtp_details/',
                                      headers={'x-access-token': global_data['token']})
    #data = response.get_data(as_text=True)
    assert response.status_code == 500

@requests_mock.Mocker(kw="mock")
def test_get_smtp_details_failure_2(global_data, **kwargs):
    kwargs["mock"].get("http://localhost:9092/kapacitor/v1/config/smtp/", json={'link': {'rel': 'self', 'href': '/kapacitor/v1/config/smtp/'}, 'options': {'enabled': True, 'from': 'vishal.s7@samsung.com', 'global': False, 'host': '112.107.220.150', 'idle-timeout': '30s', 'no-verify': False, 'password': True, 'port': 25, 'state-changes-only': False, 'to': ['palak.k2@samsung.com'], 'username': 'test'}, 'redacted': ['password']})

    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get('/api/v1.0/get_smtp_details/',
                                      headers={'x-access-token': global_data['token']})
    #data = response.get_data(as_text=True)
    assert response.status_code == 200

if __name__ == '__main__':
    print("main")


