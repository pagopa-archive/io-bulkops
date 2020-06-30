import { TableService, TableUtilities, TableQuery } from "azure-storage";
import * as dotenv from "dotenv";
import * as storage from "azure-storage";

dotenv.config();

// TODO: remove hardcoded
const storageaccount_tableName = "bulkmessages";
const storageaccount_partitionKey = "bonus-vacanze";

enum sendStatus {
    NOT_SENDED,
    SENDED
};

// DRAFT

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

    // const tableSvc = azure.createTableService();
    var tableSvc = storage.createTableService();

    var query = new TableQuery()
        .top(100)
        .where('status eq ?', sendStatus.NOT_SENDED);

    tableSvc.queryEntities(storageaccount_tableName, query, <any>null, function (error: any, result: any, response: any) {
        if (!error) {
            // query was successful
            console.log(result);
        }
    });

}

main().catch((error) => {
    console.error(error);
});
