import * as dotenv from 'dotenv';
import * as fs from 'fs';
import fetch from 'node-fetch';
import { DateTime } from 'luxon';

dotenv.config();

const apiUrl = process.env.API_URL || '';
const subscriptionKey = process.env.SUBSCRIPTION_KEY || '';
const sleep_ms = Number(process.env.SLEEP_MS || 10);
const envStartDate = process.env.START_DATE || '';
const envEndDate = process.env.END_DATE || '';

async function main() {
  const startDate = DateTime.fromFormat(
    `${envStartDate} Europe/Rome`,
    'yyyy-MM-dd z'
  );
  const endDate = DateTime.fromFormat(
    `${envEndDate} Europe/Rome`,
    'yyyy-MM-dd z'
  );

  const diff = endDate.diff(startDate, 'days').toObject().days;
  if (diff == undefined) return;

  for (let i = 0; i < diff; i++) {
    const date = startDate.plus({ days: i }).toFormat('yyyy-MM-dd');
    const rawResponse = await getSubscriptionsFeed(subscriptionKey, date);
    const content = await rawResponse.json();

    const count = content.subscriptions.length;
    fs.writeFileSync('new_users.csv', date + ',' + count + '\n', {
      flag: 'a+',
    });

    await delay(sleep_ms);
  }
}

main().catch((error) => {
  console.error(error);
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getSubscriptionsFeed(subscription_key: string, date: string) {
  const rawResponse = await fetch(`${apiUrl}/${date}`, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': subscription_key,
      'Content-Type': 'application/json',
    },
  });
  return rawResponse;
}
