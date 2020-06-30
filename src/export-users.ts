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

const START_DATE = process.env.START_DATE || "";
const END_DATE = process.env.END_DATE || "";
const STEP_HOURS = Number(process.env.STEP_HOURS || 24);


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

    const startDate = new Date(START_DATE);
    const maxDate = new Date(END_DATE);

    let fromDateTs = startDate.getTime() / 1000;
    let toDateTs = (startDate.getTime() / 1000) + (STEP_HOURS * 60 * 60);

    const clientSource = new CosmosClient({ endpoint: source_endpoint, key: source_key });
    const databaseSource = clientSource.database(source_cosmosdb_database);
    const containerSource = databaseSource.container(source_cosmosdb_container);

    const clientDestination = new CosmosClient({ endpoint: destination_endpoint, key: destination_key });
    const databaseDestination = clientDestination.database(destination_cosmosdb_database);
    const containerDestination = databaseDestination.container(destination_cosmosdb_container);

    let exitWhile = false;

    while (!exitWhile) {

        if (toDateTs > (maxDate.getTime() / 1000)) {
            // not overlap maxdate
            exitWhile = true;
            toDateTs = maxDate.getTime() / 1000;
        }

        const querySpec = {
            query: "SELECT c.fiscalCode, c._ts FROM c WHERE c.version = @version AND c._ts >= @fromDate AND c._ts <= @toDate",
            parameters: [
                { name: "@version", value: 0 },
                { name: "@fromDate", value: fromDateTs },
                { name: "@toDate", value: toDateTs }
            ]
        };

        // read all items in the Items container
        const { resources: items } = await containerSource.items
            .query(querySpec)
            .fetchAll();

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
            count = count + 1;

        }

        const queryCountSource = {
            query: "SELECT VALUE COUNT(1) FROM c WHERE c.version = @version AND c._ts >= @fromDate AND c._ts <= @toDate",
            parameters: [
                { name: "@version", value: 0 },
                { name: "@fromDate", value: fromDateTs },
                { name: "@toDate", value: toDateTs }
            ]
        };

        // read all items in the Items container
        const { resources: countSource } = await containerSource.items
            .query(queryCountSource)
            .fetchAll();

        const queryCountDestination = {
            query: "SELECT VALUE COUNT(1) FROM c WHERE c.onboardingTs >= @fromDate AND c.onboardingTs <= @toDate",
            parameters: [
                { name: "@fromDate", value: fromDateTs },
                { name: "@toDate", value: toDateTs }
            ]
        };
        const { resources: countDestination } = await containerDestination.items
            .query(queryCountDestination)
            .fetchAll();

        console.log(count);
        console.log('countSource: ' + countSource);
        console.log('countDestination: ' + countDestination);
        console.log('last toDateTs: ' + new Date(toDateTs * 1000).toISOString());

        toDateTs = toDateTs + (STEP_HOURS * 60 * 60);
        if (!exitWhile) {
            console.log('next toDateTs: ' + new Date(toDateTs * 1000).toISOString());
        }
    }

    console.log('export users finished');

}

main().catch((error) => {
    console.error(error);
});
