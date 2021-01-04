import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as parsecsv from 'csv-parse/lib/sync';
import { getMessageContent } from './messages';
import fetch from 'node-fetch';

dotenv.config();

const apiUrl = process.env.API_URL || '';
const subscriptionKey = process.env.SUBSCRIPTION_KEY || '';
const sleep_ms = Number(process.env.SLEEP_MS || 10);
const sleep429_ms = Number(process.env.SLEEP429_MS || 5000);
const messageContent = process.env.MESSAGE_CONTENT || '';

enum SendCSV {
  fiscal_code = 'fiscal_code',
}

enum SkipCSV {
  fiscal_code = 'fiscal_code',
}

enum SendedCSV {
  fiscal_code = 'fiscal_code',
  response_code = 'response_code',
  id_message = 'id_message',
}

async function main() {
  let cf_send_csv = '';
  let cf_skip_csv = '';

  if (process.argv.length > 2) {
    cf_send_csv = String(process.argv[2]);
  } else {
    console.error('You need to specify input csv');
    return;
  }
  if (process.argv.length > 3) {
    cf_skip_csv = String(process.argv[3]);
  }

  const logFile = cf_send_csv.replace('.csv', '') + '.log';
  startLogFile(logFile);

  const cf_sended_csv = cf_send_csv.replace('.csv', '') + '_sended.csv';

  let cf_send_items = undefined;
  if (fs.existsSync(cf_send_csv)) {
    // File exists in path
    const cf_send_file = fs.readFileSync(cf_send_csv).toString();
    cf_send_items = parsecsv(cf_send_file, {
      columns: true,
      skip_empty_lines: true,
    });
    // console.log('cf_send_items');
    // console.log(cf_send_items);
  } else {
    // File doesn't exist in path
    console.error(cf_send_csv + ' file not found');
    return;
  }

  let cf_sended_items = undefined;

  if (fs.existsSync(cf_sended_csv)) {
    // File exists in path
    const cf_sended_file = fs.readFileSync(cf_sended_csv).toString();
    cf_sended_items = parsecsv(cf_sended_file, {
      columns: true,
      skip_empty_lines: true,
    });
    // console.log('cf_sended_items');
    // console.log(cf_sended_items);
  } else {
    // File doesn't exist in path
  }

  let cf_skip_items = undefined;

  if (fs.existsSync(cf_skip_csv)) {
    // File exists in path
    const cf_skip_file = fs.readFileSync(cf_skip_csv).toString();
    cf_skip_items = parsecsv(cf_skip_file, {
      columns: true,
      skip_empty_lines: true,
    });
    // console.log('cf_skip_csv');
    // console.log(cf_skip_csv);
  } else {
    // File doesn't exist in path
  }

  if (cf_skip_items != undefined) {
    for (const cf_skip of cf_skip_items) {
      cf_send_items = cf_send_items.filter(
        (x: { [x: string]: any }) =>
          x[SendCSV.fiscal_code] != cf_skip[SkipCSV.fiscal_code]
      );
    }
  }

  if (cf_sended_items != undefined) {
    const cf_sended_skip_items = cf_sended_items.filter(
      (x: { [x: string]: string }) =>
        x[SendedCSV.response_code] == '201' ||
        x[SendedCSV.response_code] == '200'
    );
    for (const cf_sended_skip of cf_sended_skip_items) {
      cf_send_items = cf_send_items.filter(
        (x: { [x: string]: any }) =>
          x[SendCSV.fiscal_code] != cf_sended_skip[SendedCSV.fiscal_code]
      );
    }
  }

  // console.log('cf_send_items clean');
  // console.log(cf_send_items);

  // create sending log items
  const cf_sendeding_csv = cf_send_csv.replace('.csv', '') + '_sendeding.csv';
  fs.writeFileSync(
    cf_sendeding_csv,
    SendedCSV.fiscal_code +
      ',' +
      SendedCSV.response_code +
      ',' +
      SendedCSV.id_message +
      '\n'
  );

  // backup existing sended messages in cf_sendeding_csv file
  if (cf_sended_items != undefined) {
    for (const cf of cf_sended_items.filter(
      (x: { [x: string]: string }) =>
        x[SendedCSV.response_code] == '201' ||
        x[SendedCSV.response_code] == '200'
    )) {
      fs.writeFileSync(
        cf_sendeding_csv,
        cf[SendedCSV.fiscal_code] +
          ',' +
          cf[SendedCSV.response_code] +
          ',' +
          cf[SendedCSV.id_message] +
          '\n',
        { flag: 'a+' }
      );
    }
  }

  appendLogFile(logFile, 'Info - messages to send: ' + cf_send_items.length);
  console.log('Info - messages to send: ' + cf_send_items.length + '\n');
  let countMessageSended = 0;
  let countProgressMessageSended = 0;

  // send messages
  for (const cf of cf_send_items) {
    try {
      const rawResponse = await submitMessageforUser(
        cf[SendCSV.fiscal_code],
        subscriptionKey
      );
      const content = await rawResponse.json();

      let newSendItem = {
        fiscal_code: cf[SendCSV.fiscal_code],
        response_code: rawResponse.status,
        id_message: '',
      };

      if (rawResponse.status == 201 || rawResponse.status == 200) {
        newSendItem.id_message = content.id;

        countMessageSended = countMessageSended + 1;
        countProgressMessageSended = countProgressMessageSended + 1;
      } else {
        console.error(
          `Error - fiscal_code: ${cf[SendCSV.fiscal_code]} response_code: ${
            rawResponse.status
          }\n`
        );
        appendLogFile(
          logFile,
          `Error - fiscal_code: ${cf[SendCSV.fiscal_code]} response_code: ${
            rawResponse.status
          }`
        );
        if (rawResponse.status == 429) {
          await delay(sleep429_ms);
          const rawResponseRetry = await submitMessageforUser(
            cf[SendCSV.fiscal_code],
            subscriptionKey
          );
          const contentRetry = await rawResponseRetry.json();
          newSendItem.response_code = rawResponseRetry.status;
          if (
            rawResponseRetry.status == 201 ||
            rawResponseRetry.status == 200
          ) {
            newSendItem.id_message = contentRetry.id;
            appendLogFile(logFile, `Error - 429 resolved`);
            console.log(`Error - 429 resolved\n`);
            countMessageSended = countMessageSended + 1;
            countProgressMessageSended = countProgressMessageSended + 1;
          }
        }
      }

      // save sended message
      fs.writeFileSync(
        cf_sendeding_csv,
        newSendItem.fiscal_code +
          ',' +
          newSendItem.response_code +
          ',' +
          newSendItem.id_message +
          '\n',
        { flag: 'a+' }
      );

      if (countProgressMessageSended == 100) {
        appendLogFile(logFile, `Info - messages sended: ${countMessageSended}`);
        console.log(`Info - messages sended: ${countMessageSended}\n`);
        countProgressMessageSended = 0;
      }
      await delay(sleep_ms);
    } catch (e) {
      console.error(e);
      appendLogFile(logFile, `Error - ${e}`);
    }
  }

  appendLogFile(logFile, `Info - messages sended: ${countMessageSended}`);
  console.log(`Info - messages sended: ${countMessageSended}\n`);

  let nowDate = new Date();
  const cf_sended_old_csv =
    cf_send_csv.replace('.csv', '') +
    '_sended_' +
    nowDate.getFullYear() +
    nowDate.getMonth() +
    nowDate.getDay() +
    nowDate.getHours() +
    nowDate.getMinutes() +
    nowDate.getSeconds() +
    '.csv';

  if (fs.existsSync(cf_sended_csv)) {
    fs.copyFileSync(cf_sended_csv, cf_sended_old_csv);
    fs.unlinkSync(cf_sended_csv);
  }

  fs.copyFileSync(cf_sendeding_csv, cf_sended_csv);
  fs.unlinkSync(cf_sendeding_csv);

  endLogFile(logFile);
}

main().catch((error) => {
  console.error(error);
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Submit the message to a user identified by his/her fiscal code.
async function submitMessageforUser(
  fiscal_code: string,
  subscription_key: string
) {
  let message = {
    content: getMessageContent(messageContent),
    time_to_live: 3600,
    fiscal_code: fiscal_code,
  };
  const rawResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': subscription_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  //const content = await rawResponse.json();
  //console.log(content);
  //console.log(rawResponse.status);
  return rawResponse;
}

function startLogFile(filepath: string) {
  const nowDate = new Date().toISOString();
  fs.writeFileSync(filepath, nowDate + ' ---- START ----\n');
}

function appendLogFile(filepath: string, content: string) {
  const nowDate = new Date().toISOString();
  fs.writeFileSync(filepath, nowDate + ' ---- ' + content + '\n', {
    flag: 'a+',
  });
}

function endLogFile(filepath: string) {
  const nowDate = new Date().toISOString();
  fs.writeFileSync(filepath, nowDate + ' ---- END ----\n', { flag: 'a+' });
}
