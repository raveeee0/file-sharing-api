#!/bin/bash

# Load the environment variables from the .env file
source .env

# Start MongoDB withouth authentication
mongod --port $TEST_MONGO_PORT --dbpath $TEST_MONGO_PATH &

# Wait for the MongoDB instance to start
sleep 5

# Connect to the MongoDB instance
mongosh --port $TEST_MONGO_PORT <<EOF
use admin
db.createUser(
    {
        user: "$TEST_MONGODB_USER",
        pwd: "$TEST_MONGODB_PASSWORD",
        roles: [
            { role: "userAdminAnyDatabase", db: "admin" },
            { role: "readWriteAnyDatabase", db: "admin" },
            { role: "clusterAdmin", db: "admin" }
        ]
    }
)
EOF

# Stop the MongoDB instance
mongod --port $TEST_MONGO_PORT --dbpath $TEST_MONGO_PATH --shutdown

# Start MongoDB with authentication
mongod --auth --port $TEST_MONGO_PORT --dbpath $TEST_MONGO_PATH &

# Wait for the MongoDB instance to start
sleep 5

echo "MongoDB has been configured"