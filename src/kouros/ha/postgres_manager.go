package ha

import (
	"database/sql"
	"fmt"
	pb "kouros/api"
)

type PostgresConnection struct {
	host     string
	port     string
	username string
	password string
	dbname   string
}

type PostgresHAManager struct {
	connection PostgresConnection
}

func (p *PostgresHAManager) init(host, port, username, password, dbname string) {
	p.connection = PostgresConnection{
		host:     host,
		port:     port,
		username: username,
		password: password,
		dbname:   dbname,
	}
}

func (p *PostgresHAManager) connect() (*sql.DB, error) {
	psqlconn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		p.connection.host, p.connection.port, p.connection.username, p.connection.password, p.connection.dbname)
	return sql.Open("postgres", psqlconn)
}

func (p *PostgresHAManager) listNodes() (*pb.ListNodeResponse, error) {
	return &pb.ListNodeResponse{}, nil
}
