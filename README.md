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
START_DATE="2020-03-01T00:00:00.000Z"
END_DATE="2020-04-30T21:59:59.000Z"
STEP_MINUTES="10"
MAX_USERS="10"

API_URL="https://api.io.italia.it/api/v1/messages"
SUBSCRIPTION_KEY="XXX"
SLEEP_MS="100"
SLEEP429_MS="1000"
CF_NOSENDCSV="src/ignore/file.csv"
```

### run 

ts-node src/export-users.ts
ts-node src/send-messages.ts

