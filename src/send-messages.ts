import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const { CosmosClient } = require("@azure/cosmos");

const destination_endpoint = process.env.DESTINATION_COSMOSDB_ENDPOINT;
const destination_key = process.env.DESTINATION_COSMOSDB_KEY;
const destination_cosmosdb_database = process.env.DESTINATION_COSMOSDB_DATABASE;
const destination_cosmosdb_container = process.env.DESTINATION_COSMOSDB_CONTAINER;

const prefix_partitionKey = process.env.PREFIX_PARTITIONKEY || "";
const max_users = Number(process.env.MAX_USERS);

const API_URL = process.env.API_URL || "";
const subscription_key = process.env.SUBSCRIPTION_KEY || "";
const sleep_ms = Number(process.env.SLEEP_MS || 100);
const sleep429_ms = Number(process.env.SLEEP429_MS || 1000);

enum sendStatus {
    NOT_SENDED,
    SENDED
};

async function main() {

    const clientDestination = new CosmosClient({ endpoint: destination_endpoint, key: destination_key });
    const databaseDestination = clientDestination.database(destination_cosmosdb_database);
    const containerDestination = databaseDestination.container(destination_cosmosdb_container);

    const queryCount = {
        query: "SELECT VALUE COUNT(1) FROM c WHERE c.sendStatus = @sendStatus OFFSET 0 LIMIT @maxUsers",
        parameters: [
            { name: "@sendStatus", value: sendStatus.NOT_SENDED },
            { name: "@maxUsers", value: max_users }
        ]
    };

    // read all items in the Items container
    const { resources: countExpected } = await containerDestination.items
        .query(queryCount)
        .fetchAll();

    console.log('countExpected: ' + countExpected);

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

    let countProgress = 0;
    let countTmpProgress = 0;
    let countSended = 0;
    let countNotSended = 0;
    let countNotSended429 = 0;

    for (const item of items) {

        try {
            const fiscalCodePure = String(item.fiscalCode).replace(prefix_partitionKey, "");

            // console.log(fiscalCodePure);
            const rawResponse = await submitMessageforUser(fiscalCodePure, subscription_key);
            const content = await rawResponse.json();

            if (rawResponse.status == 201) {

                item.sendStatus = sendStatus.SENDED;
                item.idMessage = content.id;
                item.httpStatusCode = rawResponse.status;

                const { id, fiscalCode } = item;
                const { resource: updatedItem } = await containerDestination
                    .item(id, fiscalCode)
                    .replace(item);

                // console.log(`Updated item: ${updatedItem.id} - ${updatedItem.fiscalCode}`);
                // console.log(`Updated sendStatus to ${updatedItem.sendStatus}`);
                // console.log(`Updated httpStatusCode to ${updatedItem.httpStatusCode}`);
                // console.log(`Updated idMessage to ${updatedItem.idMessage}\n`);

                countSended = countSended + 1;

            } else {

                item.httpStatusCode = rawResponse.status;

                const { id, fiscalCode } = item;
                const { resource: updatedItem } = await containerDestination
                    .item(id, fiscalCode)
                    .replace(item);

                // console.error(`Error item: ${updatedItem.id} - ${updatedItem.fiscalCode}`);
                // console.error(`Error sendStatus to ${updatedItem.sendStatus}`);
                console.error(`Error httpStatusCode to ${updatedItem.httpStatusCode}\n`);

                countNotSended = countNotSended + 1;

                if (rawResponse.status == 429) {
                    await delay(sleep429_ms);
                    countNotSended429 = countNotSended429 + 1;
                }

            }
            countTmpProgress = countTmpProgress + 1;
            countProgress = countProgress + 1;

            if (countTmpProgress >= 100) {
                console.log('sending....: ' + countProgress);
                countTmpProgress = 0;
            }

            await delay(sleep_ms);

        } catch (e) {
            console.error(e);
        }

    }

    console.log('countProcessed: ' + countProgress);
    console.log('countSended ok: ' + countSended);
    console.log('countNotSended ko: ' + countNotSended);
    console.log('countNotSended429 ko: ' + countNotSended429);

    console.log('send message finished');

}

main().catch((error) => {
    console.error(error);
});

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const MESSAGE_CONTENT = {
    subject: "E' arrivato il Bonus Vacanze!",
    markdown:
        "---\nit:\n    cta_1: \n        text: \"Richiedi il Bonus Vacanze\"\n        action: \"ioit://BONUS_AVAILABLE_LIST\"\nen:\n    cta_1: \n        text: \"Claim the Bonus Vacanze\"\n        action: \"ioit://BONUS_AVAILABLE_LIST\"\n---\n\n\nDa oggi è possibile richiedere il Bonus Vacanze, istituito dal Decreto Rilancio per incentivare  il turismo dopo il lockdown dovuto all'emergenza Coronavirus.\n\nIl bonus può valere fino a 500 euro, a seconda della numerosità del nucleo familiare, ed è spendibile per soggiorni in Italia, presso imprese turistiche ricettive, agriturismi e bed & breakfast, dal 1 luglio al 31 dicembre 2020. Possono ottenere il contributo i nuclei familiari con ISEE fino a 40.000 euro.\n\nSei maggiorenne e hai le caratteristiche per richiederlo? Scopri di più e richiedilo adesso.\n\nPer poter richiedere il Bonus Vacanze, devi avere installato l'ultima versione dell'app.\n\n[App Store](https://apps.apple.com/it/app/io/id1501681835)\n\n[Play Store](https://play.google.com/store/apps/details?id=it.pagopa.io.app)\n\n"
};
// Submit the message to a user identified by his/her fiscal code.
async function submitMessageforUser(
    fiscal_code: string,
    subscription_key: string
) {
    let message = {
        content: MESSAGE_CONTENT,
        time_to_live: 3600,
        fiscal_code: fiscal_code,
    };
    const rawResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": subscription_key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
    //const content = await rawResponse.json();
    //console.log(content);
    //console.log(rawResponse.status);
    return rawResponse;
}
