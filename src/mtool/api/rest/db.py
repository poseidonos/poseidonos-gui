from util.db.database_handler import DBConnection, DBType

connection_obj = DBConnection()
connection_factory = connection_obj.get_db_connection(
    DBType.SQLite)
connection_factory.connect_database()
connection_factory.create_default_database()