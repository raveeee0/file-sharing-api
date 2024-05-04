#!/bin/bash

# Load the environment variables from the .env file
source .env


# Check if the path in TEST_MONGO_PATH exists, if not create the folders
if [ ! -d "$TEST_MONGO_PATH" ]; then
    mkdir -p "$TEST_MONGO_PATH"
fi

# Create a dedicate user for the MongoDB instance if it does not exist

if ! id -u mongodb &>/dev/null; then
    printf "Creating mongodb user\n"
    sudo useradd -r mongodb
fi

# Change the ownership of the MongoDB persistence path if it is not owned by the mongodb user
if [ "$(stat -c %U $TEST_MONGO_PATH)" != "mongodb" ]; then
    sudo chown -R mongodb:mongodb $TEST_MONGO_PATH
fi

# Increase the limit of open files if not already set
if ! grep -q "mongodb" /etc/security/limits.conf; then
    printf "Increasing the limit of open files for the mongodb user\n"
    sudo bash -c "echo 'mongodb soft nofile 64000' >> /etc/security/limits.conf"
    sudo bash -c "echo 'mongodb hard nofile 64000' >> /etc/security/limits.conf"
fi


# Start MongoDB without authentication (redirect output to /dev/null)
printf "Starting MongoDB to configure authentication\n"
sudo -u mongodb mongod --port $TEST_MONGO_PORT --dbpath $TEST_MONGO_PATH >/dev/null 2>&1 &

# Wait for the MongoDB instance to start
sleep 5

# Connect to the MongoDB instance and create user (redirect output to /dev/null)
mongosh --port $TEST_MONGO_PORT <<EOF >/dev/null
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

printf "Database admin for test has been created\n"

# Stop the MongoDB instance
printf "Stopping MongoDB to configure authentication\n"
sudo -u mongodb mongod --port $TEST_MONGO_PORT --dbpath $TEST_MONGO_PATH --shutdown >/dev/null 2>&1

# Wait for the MongoDB instance to stop
sleep 5

# Start MongoDB with authentication (redirect output to /dev/null)
printf "Starting MongoDB with authentication\n"
sudo -u mongodb mongod --auth --port $TEST_MONGO_PORT --dbpath $TEST_MONGO_PATH >/dev/null 2>&1 &

# Wait for the MongoDB instance to start
sleep 5

printf "MongoDB for test has been configured\n"