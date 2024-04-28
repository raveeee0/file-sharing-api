#!/bin/bash

# Load the environment variables from the .env file
source .env

# Connect to the MongoDB instance and issue the shutdown command
mongosh --port $TEST_MONGO_PORT --username $TEST_MONGODB_USER --password $TEST_MONGODB_PASSWORD --authenticationDatabase admin <<EOF
use admin
db.shutdownServer()
EOF

# Remove the data from the MongoDB persistence path
sudo rm -rf $TEST_MONGO_PATH/*

# Reset the MongoDB persistence path
sudo mkdir -p $TEST_MONGO_PATH
sudo chown -R mongodb:mongodb $TEST_MONGO_PATH
sudo chown mongodb:mongodb /tmp/mongodb-$TEST_MONGO_PORT.sock    



echo "MongoDB instance has been stopped"