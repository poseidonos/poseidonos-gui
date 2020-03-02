package mongodb

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"A-module/log"
)

const DB_NAME = "ibof"

func getMongoDBClient() *mongo.Client {
	log.Printf("getMongoDBClient start")

	ctx := context.Background()
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		log.Fatalf("MongoDB Connection Error : %f", err)
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatalf("MongoDB Connection Ping : %f", err)
	}

	return client
}

type UserScheme struct {
	Id       string `bson:"_id"`
	Password string `bson:"password"`
	Active   bool   `bson:"active"`
}

func ReadAllUserIdPassword() map[string]string {
	var users = make(map[string]string)

	logic := func(ctx context.Context, collection *mongo.Collection) error {
		filter := bson.D{}
		cur, err := collection.Find(ctx, filter)

		if err != nil {
			log.Println(err)
		} else {
			for cur.Next(ctx) {
				defer cur.Close(ctx)
				var user UserScheme
				err = cur.Decode(&user)

				if err != nil {
					log.Fatalf("Error on Decoding the document : %f", err)
				}

				users[user.Id] = user.Password
			}
		}
		return err
	}

	readUserCollectionByFunc(logic)

	return users
}

func ReadUserCollectionById(id string) UserScheme {
	var user UserScheme

	logic := func(ctx context.Context, collection *mongo.Collection) error {
		filter := bson.D{{"_id", id}}
		err := collection.FindOne(ctx, filter).Decode(&user)
		return err
	}
	readUserCollectionByFunc(logic)
	return user
}

func readUserCollectionByFunc(f func(context.Context, *mongo.Collection) error) {
	ctx := context.Background()
	client := getMongoDBClient()
	collection := client.Database("ibof").Collection("user")
	err := f(ctx, collection)

	if err != nil {
		log.Fatal("Error on Decoding the document", err)
	}
}
