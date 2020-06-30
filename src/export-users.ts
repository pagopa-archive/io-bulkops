import * as dotenv from "dotenv";

dotenv.config();

const { CosmosClient } = require("@azure/cosmos");

const source_key = process.env.SOURCE_COSMOSDB_KEY;
const source_endpoint = process.env.SOURCE_COSMOSDB_ENDPOINT;
const source_cosmosdb_database = process.env.SOURCE_COSMOSDB_DATABASE;
const source_cosmosdb_container = process.env.SOURCE_COSMOSDB_CONTAINER;

const destination_endpoint = process.env.DESTINATION_COSMOSDB_ENDPOINT;
const destination_key = process.env.DESTINATION_COSMOSDB_KEY;
const destination_cosmosdb_database = process.env.DESTINATION_COSMOSDB_DATABASE;
const destination_cosmosdb_container = process.env.DESTINATION_COSMOSDB_CONTAINER;

const prefix_partitionKey = process.env.PREFIX_PARTITIONKEY;

enum sendStatus {
    NOT_SENDED,
    SENDED
};

const newItem = {
    fiscalCode: "",
    sendStatus: sendStatus.NOT_SENDED,
    onboardingDate: "",
    onboardingTs: 0,
    httpStatusCode: -1,
};

async function main() {

    // 15 april 2020 22:00:00 UTC -> 16 april 2020 00:00:00 CEST
    let fromDate = Date.UTC(2019, 3, 15, 22, 0, 0);
    // from milliseconds to seconds precision
    fromDate = fromDate / 1000;
    // add 2 hour to convert from UTC to CEST
    fromDate = fromDate + (2 * 60 * 60);

    // 30 june 2020 21:59:59 UTC -> 30 june 2020 23:59:59 CEST
    let toDate = Date.UTC(2020, 5, 30, 21, 59, 59);
    // from milliseconds to seconds precision
    toDate = toDate / 1000;
    // add 2 hour to convert from UTC to CEST
    toDate = toDate + (2 * 60 * 60);

    const clientSource = new CosmosClient({ endpoint: source_endpoint, key: source_key });

    const databaseSource = clientSource.database(source_cosmosdb_database);
    const containerSource = databaseSource.container(source_cosmosdb_container);

    const querySpec = {
        query: "SELECT c.fiscalCode, c._ts FROM c WHERE c.version = @version AND c._ts >= @fromDate AND c._ts <= @toDate",
        parameters: [
            { name: "@version", value: 0 },
            { name: "@fromDate", value: fromDate },
            { name: "@toDate", value: toDate }
        ]
    };

    // read all items in the Items container
    const { resources: items } = await containerSource.items
        .query(querySpec)
        .fetchAll();

    const clientDestination = new CosmosClient({ endpoint: destination_endpoint, key: destination_key });
    const databaseDestination = clientDestination.database(destination_cosmosdb_database);
    const containerDestination = databaseDestination.container(destination_cosmosdb_container);

    let count = 0;

    for (const item of items) {

        newItem.fiscalCode = prefix_partitionKey + item.fiscalCode;
        newItem.onboardingDate = new Date(item._ts * 1000).toISOString();
        newItem.onboardingTs = item._ts;

        // console.log(newItem.fiscalCode);

        try {
            const { resource: createdItem } = await containerDestination.items.create(newItem);
            // console.log(`\nCreated new item: ${createdItem.fiscalCode}\n`);
            count = count + 1;
            console.log(count);
        } catch (e) {
            if (e.code != 409) {
                console.log(e);
            }
        }
    }

    const queryCountSource = {
        query: "SELECT VALUE COUNT(1) FROM c WHERE c.version = @version AND c._ts >= @fromDate AND c._ts <= @toDate",
        parameters: [
            { name: "@version", value: 0 },
            { name: "@fromDate", value: fromDate },
            { name: "@toDate", value: toDate }
        ]
    };
    // read all items in the Items container
    const { resources: countSource } = await containerSource.items
        .query(queryCountSource)
        .fetchAll();


    const queryCountDestination = {
        query: "SELECT VALUE COUNT(1) FROM c"
    };
    const { resources: countDestination } = await containerDestination.items
        .query(queryCountDestination)
        .fetchAll();

    console.log('countSource: ' + countSource);
    console.log('countDestination: ' + countDestination);
    console.log('export users finished');

}

main().catch((error) => {
    console.error(error);
});
