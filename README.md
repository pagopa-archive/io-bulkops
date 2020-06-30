# TODO

Use this template when creating new typescript projects.

npm install -g ts-node
npm install -g typescript

npm install

yarn install
yarn build

cp .env.exsample .env

```bash
# source
SOURCE_COSMOSDB_KEY="XXX"
SOURCE_COSMOSDB_ENDPOINT="XXX"
SOURCE_COSMOSDB_DATABASE="XXX"
SOURCE_COSMOSDB_CONTAINER="XXX"

# destination
DESTINATION_COSMOSDB_KEY="XXX"
DESTINATION_COSMOSDB_ENDPOINT="XXX"
DESTINATION_COSMOSDB_DATABASE="XXX"
DESTINATION_COSMOSDB_CONTAINER="XXX"

PREFIX_PARTITIONKEY="prefix-"
MAX_USERS="10"
```

### run 

ts-node src/export-users.ts
ts-node src/send-messages.ts

