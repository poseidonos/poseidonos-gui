

import random
import string
from random import randint


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


BOOL_LIST = [True, False]

ALERT_CONDITION_LIST = [
    'Greater Than',
    'Less Than',
    'Greater Than Equal To',
    'Equal To']
NUM_OF_EMAILS = 6
NUM_OF_USER = 6
NUM_OF_ALERTS = 6
EMAIL_LIST = []
USER_LIST = [{'_id': 'admin',
              'password': 'admin',
              'email': 'admin@corp.com',
              'phone_number': 'xxxxxxxxxx',
              'role': 'admin',
              'active': True,
              'privileges': 'Create, Read, Edit, Delete',
              'ibofostimeinterval': 4,
              'livedata': True}]
ALERT_LIST = []

for i in range(0, NUM_OF_EMAILS):
    EMAIL = random_string(6)
    EMAIL = EMAIL + "@" + EMAIL + ".com"
    ACTIVE = BOOL_LIST[randint(0, 1)]
    EMAIL_JSON = {'email': EMAIL, 'active': ACTIVE}
    EMAIL_LIST.append(EMAIL_JSON)

for i in range(0, NUM_OF_USER):
    USERNAME = random_string(6)
    PASSWORD = random_string(6)
    EMAIL = random_string(6)
    EMAIL = EMAIL + "@" + EMAIL + ".com"
    PHONE_NUMBER = str(randint(9000000000, 9990000000))
    ROLE = 'admin'
    ACTIVE = BOOL_LIST[randint(0, 0)]
    PRIVILEGES = 'Create, Read, Edit, Delete'
    IBOFOSTIMEINTERVAL = randint(4, 30)
    LIVEDATA = BOOL_LIST[randint(0, 1)]
    USER = {
        '_id': USERNAME,
        'password': PASSWORD,
        'email': EMAIL,
        'phone_number': PHONE_NUMBER,
        'role': ROLE,
        'active': ACTIVE,
        'privileges': PRIVILEGES,
        'ibofostimeinterval': IBOFOSTIMEINTERVAL,
        'livedata': LIVEDATA}
    USER_LIST.append(USER)

for i in range(0, NUM_OF_ALERTS):
    ALERTNAME = random_string(10)
    ALERTCLUSTER = 'cpu'
    ALERTSUBCLUSTER = 'cpu'
    ALERTTYPE = 'cpu-total'
    ALERTCONDITION = ALERT_CONDITION_LIST[randint(0, 3)]
    ALERTFIELD = 'usage_user'
    DESCRIPTION = random_string(30)
    ALERTRANGE = str(randint(5, 40))
    ACTIVE = BOOL_LIST[randint(0, 1)]
    ALERT = {
        'alertName': ALERTNAME,
        'alertCluster': ALERTCLUSTER,
        'alertSubCluster': ALERTSUBCLUSTER,
        'alertType': ALERTTYPE,
        'alertCondition': ALERTCONDITION,
        'alertField': ALERTFIELD,
        'description': DESCRIPTION,
        'alertRange': ALERTRANGE,
        'active': ACTIVE}
    ALERT_LIST.append(ALERT)



