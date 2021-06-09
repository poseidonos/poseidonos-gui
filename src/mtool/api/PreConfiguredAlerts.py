'''
import requests
from util.macros.influxdb_config import mtool_db, infinite_rp, default_rp
chronograf = 'chronograf'

KAPACITOR_URL = 'http://localhost:9092/kapacitor/v1'

opertorMAP = {
    'Greater Than': '>', 'Less Than': '<',
    'Equal To': '==', 'Not Equal To': '!=',
    'Equal To Or Greater': '>=',
    'Equal To Or Less Than': '<=',
    'Inside Range': 'check', ''
    'Outside Range': 'check'
}


def create_kapacitor_alert(
        alertName,
        alertType,
        alertCondition,
        alertRange,
        alertField,
        alertCluster,
        alertSubCluster,
        description):
    """
    Create alerts using kapacitor which are created by the user
    :param alertName:
    :param alertType:
    :param alertCondition:
    :param alertRange:
    :param alertField:
    :param alertCluster:
    :param alertSubCluster:
    :param description:
    :return: Response from kapacitor
    """
    kapacitorUrl = KAPACITOR_URL + "/tasks"
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
        " idTag = 'alertID'\n\nvar levelTag = 'level'\n\nvar messageField = 'message'\n\n"
        "var durationField = 'duration'\n\nvar outputDB = '{}'\n\nvar outputRP = '{}'"
        "\n\nvar outputMeasurement = 'alerts'\n\nvar triggerType = 'threshold'\n\nvar crit = {}\n\n"
        "var data = stream\n    |from()\n        .database(db)\n        .retentionPolicy(rp)\n "
        "       .measurement(measurement)\n        .groupBy(groupBy)\n   "
        " |eval(lambda: \"{}\")\n        .as('value')\n\nvar trigger = data\n    |alert()\n  "
        "      .crit(lambda: \"value\" {} crit)\n        .message(message)\n        .id(idVar)\n   "
        "     .idTag(idTag)\n        .levelTag(levelTag)\n        .messageField(messageField)\n       "
        " .durationField(durationField)\n        .stateChangesOnly()\n\ntrigger\n    |eval(lambda: float(\"value\"))\n "
        "       .as('value')\n        .keep()\n    |influxDBOut()\n        .create()\n        .database(outputDB)\n"
        "        .retentionPolicy(outputRP)\n        .measurement(outputMeasurement)\n        .tag('alertName', name)\n "
        "       .tag('triggerType', triggerType)\n\ntrigger\n    |httpOut('output')\n".format(
            mtool_db,
            default_rp,
            alertCluster,#1,1,
            alertSubCluster,
            alertType,
            alertName,
            description,
            chronograf,
            infinite_rp,
            alertRange,
            alertField,
            opertorMAP[alertCondition])}
    # print(payload)
    r = requests.post(kapacitorUrl, json=payload)
#    if r.status_code == 200:
    return r

def delete_alert_from_kapacitor(alert_id):
    kapacitorUrl = KAPACITOR_URL + "/tasks/{}".format(alert_id)
    r = requests.delete(kapacitorUrl)
    return r

if __name__ == '__main__':
    print("Setting Kapacitor Pre-Configured Alerts")
    delete_alert_from_kapacitor("DefaultCPUAlert")
    create_kapacitor_alert("DefaultCPUAlert","","Less Than","90","usage_user","cpu","","Pre-Configured CPU Alert")
'''
