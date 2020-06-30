import { TableService, TableUtilities, TableQuery } from "azure-storage";
import * as dotenv from "dotenv";
import * as storage from "azure-storage";

dotenv.config();

const { CosmosClient } = require("@azure/cosmos");
// const { azure } = require('azure-storage');

const endpoint = process.env.COSMOSDB_ENDPOINT;
const key = process.env.COSMOSDB_KEY;
const cosmosdb_database = process.env.COSMOSDB_DATABASE;
const cosmosdb_container = process.env.COSMOSDB_CONTAINER;

// TODO: remove hardcoded
const storageaccount_tableName = "bulkmessages";
const storageaccount_partitionKey = "bonus-vacanze";

enum sendStatus {
    NOT_SENDED,
    SENDED
};

async function main() {

    // 15 april 2020 22:00:00 UTC -> 16 april 2020 00:00:00 CEST
    let fromDate = Date.UTC(2020, 3, 15, 22, 0, 0);
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

    const client = new CosmosClient({ endpoint, key });

    const database = client.database(cosmosdb_database);
    const container = database.container(cosmosdb_container);

    const querySpec = {
        query: "SELECT c.fiscalCode, c._ts FROM c WHERE c.version = @version AND c._ts >= @fromDate AND c._ts <= @toDate",
        parameters: [
            { name: "@version", value: 0 },
            { name: "@fromDate", value: fromDate },
            { name: "@toDate", value: toDate }
        ]
    };

    // read all items in the Items container
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();


    // const tableSvc = azure.createTableService();
    var tableSvc = storage.createTableService();

    tableSvc.createTableIfNotExists(storageaccount_tableName, function (error: any, result: any, response: any) {
        if (!error) {
            // Table exists or created
        }
    });

    var entGen = TableUtilities.entityGenerator;

    for (const item of items) {
        var task = {
            PartitionKey: entGen.String(storageaccount_partitionKey),
            RowKey: entGen.String(item.fiscalCode),
            onboardingDate: entGen.DateTime(new Date(item._ts * 1000).toISOString()),
            status: entGen.Int32(sendStatus.NOT_SENDED)
        };
        tableSvc.insertEntity(storageaccount_tableName, task, function (error: any, result: any, response: any) {
            if (!error) {
                // Entity updated
            }
        });
        // console.log(`${item.fiscalCode}, ${item._ts} `);
    }

    console.log('export users finished');

}

main().catch((error) => {
    console.error(error);
});
