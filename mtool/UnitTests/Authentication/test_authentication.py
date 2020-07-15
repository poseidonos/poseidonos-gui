from rest.app import app
from flask import json
from unittest import mock


@mock.patch("rest.app.connection_factory.match_username_from_db",
            return_value="xyz", autospec=True)
def test_login(mock_match_username_from_db):
    response = app.test_client().post(
        '/api/v1.0/login/',
        data=json.dumps({'username': "xyz", 'password': "xyz"}),
        content_type='application/json',
    )

    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['username'] == "xyz"


@mock.patch("rest.app.connection_factory.match_username_from_db",
            return_value=None, autospec=True)
@mock.patch("rest.app.connection_factory.match_email_from_db",
            return_value=None, autospec=True)
def test_login_failure(mock_match_username_from_db, mock_match_email_from_db):
    response = app.test_client().post(
        '/api/v1.0/login/',
        data=json.dumps({'username': "xyz", 'password': "xyz"}),
        content_type='application/json',
    )

    assert response.status_code == 401


if __name__ == '__main__':
    test_login()
