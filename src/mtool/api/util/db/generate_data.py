'''
/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 '''

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
NUM_OF_TELEMETRY_URLS = 1
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



