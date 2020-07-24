'''
/*-------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         /
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/


DESCRIPTION: <File description> *
@NAME : system_alerts.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

from util.db.influx import get_connection
import requests
from util.macros.influxdb import mtool_db, infinite_rp, default_rp
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


def get_alert_categories_new():
    """
    Convert a list of lists of the form [[cpu,cpu=cpu0,usage_user],....] to a tree form
    :return: a nested json
    """
    connection = get_connection()
    # query = 'SELECT mean("usage_idle") AS "mean_usage_idle" FROM "telegraf"."autogen"."cpu" WHERE time > now()-15m AND  GROUP BY time(1285ms)'
    query = 'SHOW SERIES ON "' + mtool_db + '"'
    # print("querrryyyy",query)
    res = connection.query(query)
    connection.close()
    points = list(res.get_points())

    # Convert an list of dictionary to a nested dictionary
    final = []
    # print(points)
    # print(points[0],type(points[0]))
    categories = {}
    tagKeys = {}
    clusterId = 1
    fields_dict = {}
    subId = 0
    for item in points:
        field = item['key']
        series = field.split(',')
        if series[0] not in categories.keys():
            #print(series[0], categories.keys())
            aDict = {}
            aDict['name'] = series[0]
            # getting fields
            queryField = 'SHOW field keys from "' + mtool_db + \
                '"."' + default_rp + '"."{}"'.format(series[0])
            # print("asdadasdad",queryField)
            keyFields = connection.query(queryField)
            connection.close()
            fields_key = list(keyFields.get_points())
            # print('fieldsKey,',type(fields_key))
            fieldsDictToList = []
            for item in fields_key:
                fieldsDictToList.append(item['fieldKey'])
            # fields_dict[series[0]] =  fieldsDictToList
            aDict['alertFields'] = fieldsDictToList
            aDict['_id'] = clusterId
            clusterId = clusterId + 1
            aDict['alertSubCluster'] = []
            categories[series[0]] = 1
            # categories['subcluster'] = []
            lis = []
            subId = 1
            for tag in series[1:]:
                subDict = {}
                subDict['name'] = tag.split('=')[0]
                subDict['alertTypes'] = []
                subDict['_id'] = subId
                subsubDict = {}
                subsubDict['type'] = tag.split('=')[1]
                # subsubDict['_id'] = subId
                subId += 1
                subDict['alertTypes'].append(subsubDict)
                aDict['alertSubCluster'].append(subDict)
            final.append(aDict)
            # categories.update(aDict)
        else:
            # subId = 2
            for entry in final:
                if entry['name'] == series[0]:
                    # do for each tag
                    # id = 2
                    for tag in series[1:]:
                        for subEntry in entry['alertSubCluster']:
                            if subEntry['name'] == tag.split('=')[0]:
                                count = 0

                                for ip in subEntry['alertTypes']:
                                    if ip['type'] == tag.split('=')[1]:
                                        count += 1
                                        # subId = ip['_id']+1
                                if count == 0:
                                    newField = {}
                                    newField['type'] = tag.split('=')[1]
                                    # subId += 1
                                    # newField['_id'] = subId

                                    subEntry['alertTypes'].append(newField)

    return final, fields_dict


def get_alert_fields():
    connection = get_connection()
    # query = 'SELECT mean("usage_idle") AS "mean_usage_idle" FROM "telegraf"."autogen"."cpu" WHERE time > now()-15m AND  GROUP BY time(1285ms)'
    queryCPU = 'SHOW field keys from "' + mtool_db + '"."' + default_rp + '"."cpu"'
    res = connection.query(queryCPU)
    connection.close()
    points = list(res.get_points())
    print(points)


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
        "       .measurement(measurement)\n        .groupBy(groupBy)\n        .where(whereFilter)\n   "
        " |eval(lambda: \"{}\")\n        .as('value')\n\nvar trigger = data\n    |alert()\n  "
        "      .crit(lambda: \"value\" {} crit)\n        .message(message)\n        .id(idVar)\n   "
        "     .idTag(idTag)\n        .levelTag(levelTag)\n        .messageField(messageField)\n       "
        " .durationField(durationField)\n        .stateChangesOnly()\n\ntrigger\n    |eval(lambda: float(\"value\"))\n "
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
            chronograf,
            infinite_rp,
            alertRange,
            alertField,
            opertorMAP[alertCondition])}
    # print(payload)
    r = requests.post(kapacitorUrl, json=payload)
    return r


def update_in_kapacitor(
        alertName,
        alertType,
        alertCondition,
        alertRange,
        alertField,
        alertCluster,
        alertSubCluster,
        description):
    """
    updates a given alert in kapacitor

    :param alertName:
    :param alertType:
    :param alertCondition:
    :param alertRange:
    :param alertField:
    :param alertCluster:
    :param alertSubCluster:
    :param description:
    :return:
    """
    kapacitorUrl = KAPACITOR_URL + "/tasks/{}".format(alertName)

    payload = {
        "script": "var db = '{}'\nvar rp = '{}'\nvar measurement = '{}'\nvar groupBy = []\nvar whereFilter = "
        "lambda: (\"{}\" == '{}')\nvar name = '{}'\nvar idVar = name\nvar message = '{}'\n\nvar"
        " idTag = 'alertID'\n\nvar levelTag = 'level'\n\nvar messageField = 'message'\n\n"
        "var durationField = 'duration'\n\nvar outputDB = '{}'\n\nvar outputRP = '{}'"
        "\n\nvar outputMeasurement = 'alerts'\n\nvar triggerType = 'threshold'\n\nvar crit = {}\n\n"
        "var data = stream\n    |from()\n        .database(db)\n        .retentionPolicy(rp)\n "
        "       .measurement(measurement)\n        .groupBy(groupBy)\n        .where(whereFilter)\n   "
        " |eval(lambda: \"{}\")\n        .as('value')\n\nvar trigger = data\n    |alert()\n  "
        "      .crit(lambda: \"value\" {} crit)\n        .message(message)\n        .id(idVar)\n   "
        "     .idTag(idTag)\n        .levelTag(levelTag)\n        .messageField(messageField)\n       "
        " .durationField(durationField)\n        .stateChangesOnly()\n\ntrigger\n    |eval(lambda: float(\"value\"))\n "
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
            chronograf,
            infinite_rp,
            alertRange,
            alertField,
            opertorMAP[alertCondition])}
    res = requests.patch(kapacitorUrl, json=payload)
    # print(res)
    return res


def delete_alert_from_kapacitor(id):
    kapacitorUrl = KAPACITOR_URL + "/tasks/{}".format(id)
    r = requests.delete(kapacitorUrl)
    return r


def toggle_in_kapacitor(id, status):
    """
    Sets the status of the given alert in kapacitor
    :param id: unique id of the alert
    :param status: status to be set i.e either true or false
    :return: http response as given by kapacitor
    """
    print(status, type(status))
    kapacitorUrl = KAPACITOR_URL + "/tasks/{}".format(id)
    if status:
        alertStatus = "enabled"
    elif status == False:
        alertStatus = "disabled"

    if alertStatus:
        payload = {
            "status": "{}".format(alertStatus)
        }
        res = requests.patch(kapacitorUrl, json=payload)
        # res = requests.post(kapacitorUrl, payload)
        print('res in toggle')
        print(res, res.content)
        return res
    return requests.HTTPError


def get_alert():
    """
    Get alerts from kapacitor
    :return:
    """
    kapacitorUrl = KAPACITOR_URL + "/tasks"
    r = requests.get(kapacitorUrl)
    for task in r.json()['tasks']:
        print(task.keys())