from influxdb import InfluxDBClient
import unittest
import requests_mock
from mock import Mock
import warnings
import sys
import os
import json
sys.path.append(os.path.abspath('/root/workspace/m9k/ibofmtool/ibofmgmt/scripts'))
import create_retention_policy
import HtmlTestRunner


class RetentionPolicyTests(unittest.TestCase):
    def test_create_database(self):
        """Test create database for TestInfluxDBClient object."""
        with requests_mock.Mocker() as m:
            m.register_uri(
                requests_mock.POST,
                self.uri,
                text='{"results":[{}]}'
            )
            self.cli.create_database('new_db')
            self.assertEqual(
                m.last_request.qs['q'][0],
                'create database "new_db"'
            )

    def test_create_retention_policy_default(self):
        """Test create default ret policy for TestInfluxDBClient object."""
        example_response = '{"results":[{}]}'

        with requests_mock.Mocker() as m:
            m.register_uri(
                requests_mock.POST,
                self.uri,
                text=example_response
            )
            self.cli.create_retention_policy(
                'somename', '1d', 4, default=True, database='db'
            )

            self.assertEqual(
                m.last_request.qs['q'][0],
                'create retention policy "somename" on '
                '"db" duration 1d replication 4 shard duration 0s default'
            )

    def test_create_retention_policy(self):
        """Test create retention policy for TestInfluxDBClient object."""
        example_response = '{"results":[{}]}'

        with requests_mock.Mocker() as m:
            m.register_uri(
                requests_mock.POST,
                self.uri,
                text=example_response
            )
            self.cli.create_retention_policy(
                'somename', '1d', 4, database='db'
            )

            self.assertEqual(
                m.last_request.qs['q'][0],
                'create retention policy "somename" on '
                '"db" duration 1d replication 4 shard duration 0s'
            )

    def test_create_retention_policy_shard_duration(self):
        """Test create retention policy with a custom shard duration."""
        example_response = '{"results":[{}]}'

        with requests_mock.Mocker() as m:
            m.register_uri(
                requests_mock.POST,
                self.uri,
                text=example_response
            )
            self.cli.create_retention_policy(
                'somename2', '1d', 4, database='db',
                shard_duration='1h'
            )

            self.assertEqual(
                m.last_request.qs['q'][0],
                'create retention policy "somename2" on '
                '"db" duration 1d replication 4 shard duration 1h'
            )

    def test_create_retention_policy_shard_duration_default(self):
        """Test create retention policy with a default shard duration."""
        example_response = '{"results":[{}]}'

        with requests_mock.Mocker() as m:
            m.register_uri(
                requests_mock.POST,
                self.uri,
                text=example_response
            )
            self.cli.create_retention_policy(
                'somename3', '1d', 4, database='db',
                shard_duration='1h', default=True
            )

            self.assertEqual(
                m.last_request.qs['q'][0],
                'create retention policy "somename3" on '
                '"db" duration 1d replication 4 shard duration 1h '
                'default'
            )


    def test_create_continuous_query(self):
        """Test continuous query creation."""
        data = {"results": [{}]}
        with requests_mock.Mocker() as m:
            m.register_uri(
                requests_mock.GET,
                self.uri,
                text=json.dumps(data)
            )
            query = 'SELECT count("value") INTO "6_months"."events" FROM ' \
                    '"events" GROUP BY time(10m)'
            self.cli.create_continuous_query('cq_name', query, 'db_name')
            self.assertEqual(
                m.last_request.qs['q'][0],
                'create continuous query "cq_name" on "db_name" begin select '
                'count("value") into "6_months"."events" from "events" group '
                'by time(10m) end'
            )
            self.cli.create_continuous_query('cq_name', query, 'db_name',
                                             'EVERY 10s FOR 2m')
            self.assertEqual(
                m.last_request.qs['q'][0],
                'create continuous query "cq_name" on "db_name" resample '
                'every 10s for 2m begin select count("value") into '
                '"6_months"."events" from "events" group by time(10m) end'
            )

    
    def test_mtool_db1(self):
        self.client.get_list_database.return_value = [{u'name': u'sample'}, {u'name': u'poseidon'}]
        self.client.get_list_retention_policies.return_value = [{u'duration': u'0s', u'default': False, u'replicaN': 1, u'name': u'autogen', u'shardGroupDuration': u'168h0m0s'}, {u'duration': u'48h0m0s', u'default': True, u'replicaN': 1, u'name': u'default_rp', u'shardGroupDuration': u'24h0m0s'}, {u'duration': u'1440h0m0s', u'default': False, u'replicaN': 1, u'name': u'agg_rp', u'shardGroupDuration': u'168h0m0s'}]

        self.client.get_list_continuous_queries.return_value =  [{u'sample': []}, {u'poseidon': [{u'query': u'CREATE CONTINUOUS QUERY air_cq ON poseidon BEGIN SELECT mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_iops_read$/), mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_iops_write$/), mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_bw_read$/), mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_bw_write$/), mean(/^lat_data_0_tid_arr_[\\S]_aid_arr_[\\S]_timelag_arr_0_mean$/), mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_aid$/), mean(/^lat_data_0_tid_arr_[\\S]_aid_arr_[\\S]_aid$/) INTO poseidon.agg_rp.mean_air FROM poseidon.default_rp.air GROUP BY time(1h) END', u'name': u'air_cq'}, {u'query': u'CREATE CONTINUOUS QUERY cpu_cq ON poseidon BEGIN SELECT mean(usage_user) AS usage_user INTO poseidon.agg_rp.mean_cpu FROM poseidon.default_rp.cpu GROUP BY time(1h) END', u'name': u'cpu_cq'}]}]

        res = create_retention_policy.create_mtool_db1(self.client)
        self.assertEqual(res, "Success")

    def test_mtool_db_creation_fails(self):
        self.client.get_list_database.return_value = [{u'name': u'sample'}]
        res = create_retention_policy.create_mtool_db1(self.client)
        self.assertEqual(res, "M-Tool DB Creation Failed")

    def test_default_rp_creation_fails(self):
        self.client = Mock()
        self.client.get_list_database.return_value = [{u'name': u'sample'}, {u'name': u'poseidon'}]
        self.client.get_list_retention_policies.return_value = [{u'duration': u'0s', u'default': False, u'replicaN': 1, u'name': u'autogen', u'shardGroupDuration': u'168h0m0s'}]

        res = create_retention_policy.create_mtool_db1(self.client)
        self.assertEqual(res, "Retention Policies Creation Failed")

    def test_agg_rp_creation_fails(self):
        self.client.get_list_database.return_value = [{u'name': u'sample'}, {u'name': u'poseidon'}]
        self.client.get_list_retention_policies.return_value = [{u'duration': u'0s', u'default': False, u'replicaN': 1, u'name': u'autogen', u'shardGroupDuration': u'168h0m0s'}, {u'duration': u'48h0m0s', u'default': True, u'replicaN': 1, u'name': u'default_rp', u'shardGroupDuration': u'24h0m0s'}]

        res = create_retention_policy.create_mtool_db1(self.client)
        self.assertEqual(res, "Retention Policies Creation Failed")

    def test_air_cq_creation_fails(self):
        self.client.get_list_database.return_value = [{u'name': u'sample'}, {u'name': u'poseidon'}]
        self.client.get_list_retention_policies.return_value = [{u'duration': u'0s', u'default': False, u'replicaN': 1, u'name': u'autogen', u'shardGroupDuration': u'168h0m0s'}, {u'duration': u'48h0m0s', u'default': True, u'replicaN': 1, u'name': u'default_rp', u'shardGroupDuration': u'24h0m0s'}, {u'duration': u'1440h0m0s', u'default': False, u'replicaN': 1, u'name': u'agg_rp', u'shardGroupDuration': u'168h0m0s'}]

        self.client.get_list_continuous_queries.return_value = [{u'sample': []}, {u'poseidon': [{u'query': u'CREATE CONTINUOUS QUERY cpu_cq ON poseidon BEGIN SELECT mean(usage_user) AS usage_user INTO poseidon.agg_rp.mean_cpu FROM poseidon.default_rp.cpu GROUP BY time(1h) END', u'name': u'cpu_cq'}]}]

        res = create_retention_policy.create_mtool_db1(self.client)
        self.assertEqual(res, "Continuous Queries Creation Failed")

    def test_cpu_cq_creation_fails(self):
        self.client.get_list_database.return_value = [{u'name': u'sample'}, {u'name': u'poseidon'}]
        self.client.get_list_retention_policies.return_value = [{u'duration': u'0s', u'default': False, u'replicaN': 1, u'name': u'autogen', u'shardGroupDuration': u'168h0m0s'}, {u'duration': u'48h0m0s', u'default': True, u'replicaN': 1, u'name': u'default_rp', u'shardGroupDuration': u'24h0m0s'}, {u'duration': u'1440h0m0s', u'default': False, u'replicaN': 1, u'name': u'agg_rp', u'shardGroupDuration': u'168h0m0s'}]

        self.client.get_list_continuous_queries.return_value =  [{u'sample': []}, {u'poseidon': [{u'query': u'CREATE CONTINUOUS QUERY air_cq ON poseidon BEGIN SELECT mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_iops_read$/), mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_iops_write$/), mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_bw_read$/), mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_bw_write$/), mean(/^lat_data_0_tid_arr_[\\S]_aid_arr_[\\S]_timelag_arr_0_mean$/), mean(/^perf_data_0_tid_arr_[\\S]_aid_arr_[\\S]_aid$/), mean(/^lat_data_0_tid_arr_[\\S]_aid_arr_[\\S]_aid$/) INTO poseidon.agg_rp.mean_air FROM poseidon.default_rp.air GROUP BY time(1h) END', u'name': u'air_cq'}]}]

        res = create_retention_policy.create_mtool_db1(self.client)
        self.assertEqual(res, "Continuous Queries Creation Failed")


    def setUp(self):
        """Initialize an instance of TestInfluxDBClient object."""
        # By default, raise exceptions on warnings
        warnings.simplefilter('error', FutureWarning)
        self.client = Mock()
        self.cli = InfluxDBClient('localhost', 8086, 'username', 'password')
        self.uri =  "http://localhost:8086/query"

if __name__== "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='/root/workspace/m9k/ibofmtool/ibofmgmt/utreport'))

