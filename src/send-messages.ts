import * as dotenv from "dotenv";

dotenv.config();

const { CosmosClient } = require("@azure/cosmos");

const destination_endpoint = process.env.DESTINATION_COSMOSDB_ENDPOINT;
const destination_key = process.env.DESTINATION_COSMOSDB_KEY;
const destination_cosmosdb_database = process.env.DESTINATION_COSMOSDB_DATABASE;
const destination_cosmosdb_container = process.env.DESTINATION_COSMOSDB_CONTAINER;

const prefix_partitionKey = process.env.PREFIX_PARTITIONKEY;
const max_users = Number(process.env.MAX_USERS);

enum sendStatus {
    NOT_SENDED,
    SENDED
};

async function main() {

    const clientDestination = new CosmosClient({ endpoint: destination_endpoint, key: destination_key });
    const databaseDestination = clientDestination.database(destination_cosmosdb_database);
    const containerDestination = databaseDestination.container(destination_cosmosdb_container);

    const querySpec = {
        query: "SELECT * FROM c WHERE c.sendStatus = @sendStatus OFFSET 0 LIMIT @maxUsers",
        parameters: [
            { name: "@sendStatus", value: sendStatus.NOT_SENDED },
            { name: "@maxUsers", value: max_users }
        ]
    };

    // read all items in the Items container
    const { resources: items } = await containerDestination.items
        .query(querySpec)
        .fetchAll();

    for (const item of items) {

        try {
            const { id, fiscalCode } = item;

            item.sendStatus = sendStatus.SENDED;
            item.idMessage = makeid(6);

            const { resource: updatedItem } = await containerDestination
                .item(id, fiscalCode)
                .replace(item);

            console.log(`Updated item: ${updatedItem.id} - ${updatedItem.fiscalCode}`);
            console.log(`Updated sendStatus to ${updatedItem.sendStatus}`);
            console.log(`Updated idMessage to ${updatedItem.idMessage}\n`);

        } catch (e) {
            console.log(e);
        }

    }

}

main().catch((error) => {
    console.error(error);
});

function makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
