import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as parsecsv from 'csv-parse/lib/sync';
import fetch from 'node-fetch';

dotenv.config();

const apiUrl = process.env.API_URL || '';
const subscriptionKey = process.env.SUBSCRIPTION_KEY || '';
const sleep_ms = Number(process.env.SLEEP_MS || 10);
const sleep429_ms = Number(process.env.SLEEP429_MS || 5000);
const messageContent = process.env.MESSAGE_CONTENT || '';

enum InputCSV {
  fiscal_code = 'fiscal_code',
}

enum SkipCSV {
  fiscal_code = 'fiscal_code',
}

enum OutputCSV {
  fiscal_code = 'fiscal_code',
  response_code = 'response_code',
  sender_allowed = 'sender_allowed',
}

async function main() {
  let cf_input_csv = '';
  let cf_skip_csv = '';

  if (process.argv.length > 2) {
    cf_input_csv = String(process.argv[2]);
  } else {
    console.error('You need to specify input csv');
    return;
  }
  if (process.argv.length > 3) {
    cf_skip_csv = String(process.argv[3]);
  }

  const logFile = cf_input_csv.replace('.csv', '') + '.log';
  startLogFile(logFile);

  const cf_output_csv = cf_input_csv.replace('.csv', '') + '_output.csv';

  let cf_input_items = undefined;
  if (fs.existsSync(cf_input_csv)) {
    // File exists in path
    const cf_input_file = fs.readFileSync(cf_input_csv).toString();
    cf_input_items = parsecsv(cf_input_file, {
      columns: true,
      skip_empty_lines: true,
    });
    // console.log('cf_input_items');
    // console.log(cf_input_items);
  } else {
    // File doesn't exist in path
    console.error(cf_input_csv + ' file not found');
    return;
  }

  let cf_output_items = undefined;

  if (fs.existsSync(cf_output_csv)) {
    // File exists in path
    const cf_output_file = fs.readFileSync(cf_output_csv).toString();
    cf_output_items = parsecsv(cf_output_file, {
      columns: true,
      skip_empty_lines: true,
    });
    // console.log('cf_output_items');
    // console.log(cf_output_items);
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
      cf_input_items = cf_input_items.filter(
        (x: { [x: string]: any }) =>
          x[InputCSV.fiscal_code] != cf_skip[SkipCSV.fiscal_code]
      );
    }
  }

  if (cf_output_items != undefined) {
    const cf_output_skip_items = cf_output_items.filter(
      (x: { [x: string]: string }) =>
        x[OutputCSV.response_code] == '201' ||
        x[OutputCSV.response_code] == '200' ||
        x[OutputCSV.response_code] == '404'
    );
    for (const cf_output_skip of cf_output_skip_items) {
      cf_input_items = cf_input_items.filter(
        (x: { [x: string]: any }) =>
          x[InputCSV.fiscal_code] != cf_output_skip[OutputCSV.fiscal_code]
      );
    }
  }

  // console.log('cf_input_items clean');
  // console.log(cf_input_items);

  // create working log items
  const cf_working_csv = cf_input_csv.replace('.csv', '') + '_working.csv';
  fs.writeFileSync(
    cf_working_csv,
    OutputCSV.fiscal_code +
      ',' +
      OutputCSV.response_code +
      ',' +
      OutputCSV.sender_allowed +
      '\n'
  );

  // backup existing output in cf_working_csv file
  if (cf_output_items != undefined) {
    for (const cf of cf_output_items.filter(
      (x: { [x: string]: string }) =>
        x[OutputCSV.response_code] == '201' ||
        x[OutputCSV.response_code] == '200' ||
        x[OutputCSV.response_code] == '404'
    )) {
      fs.writeFileSync(
        cf_working_csv,
        cf[OutputCSV.fiscal_code] +
          ',' +
          cf[OutputCSV.response_code] +
          ',' +
          cf[OutputCSV.sender_allowed] +
          '\n',
        { flag: 'a+' }
      );
    }
  }

  appendLogFile(logFile, 'Info - rows to work: ' + cf_input_items.length);
  console.log('Info - rows to work: ' + cf_input_items.length + '\n');
  let countRowsCompleted = 0;
  let countProgressRowsCompleted = 0;

  // get profile messages
  for (const cf of cf_input_items) {
    try {
      const rawResponse = await getProfile(
        cf[InputCSV.fiscal_code],
        subscriptionKey
      );
      const content = await rawResponse.json();

      let newRowItem = {
        fiscal_code: cf[InputCSV.fiscal_code],
        response_code: rawResponse.status,
        sender_allowed: '',
      };

      if (
        rawResponse.status == 201 ||
        rawResponse.status == 200 ||
        rawResponse.status == 404
      ) {
        newRowItem.sender_allowed = content.sender_allowed;

        countRowsCompleted = countRowsCompleted + 1;
        countProgressRowsCompleted = countProgressRowsCompleted + 1;
      } else {
        console.error(
          `Error - fiscal_code: ${cf[InputCSV.fiscal_code]} response_code: ${
            rawResponse.status
          }\n`
        );
        appendLogFile(
          logFile,
          `Error - fiscal_code: ${cf[InputCSV.fiscal_code]} response_code: ${
            rawResponse.status
          }`
        );
        if (rawResponse.status == 429) {
          await delay(sleep429_ms);
          const rawResponseRetry = await getProfile(
            cf[InputCSV.fiscal_code],
            subscriptionKey
          );
          const contentRetry = await rawResponseRetry.json();
          newRowItem.response_code = rawResponseRetry.status;
          if (
            rawResponseRetry.status == 201 ||
            rawResponseRetry.status == 200 ||
            rawResponseRetry.status == 404
          ) {
            newRowItem.sender_allowed = contentRetry.id;
            appendLogFile(logFile, `Error - 429 resolved`);
            console.log(`Error - 429 resolved\n`);
            countRowsCompleted = countRowsCompleted + 1;
            countProgressRowsCompleted = countProgressRowsCompleted + 1;
          }
        }
      }

      // save row completed
      fs.writeFileSync(
        cf_working_csv,
        newRowItem.fiscal_code +
          ',' +
          newRowItem.response_code +
          ',' +
          newRowItem.sender_allowed +
          '\n',
        { flag: 'a+' }
      );

      if (countProgressRowsCompleted == 100) {
        appendLogFile(logFile, `Info - rows completed: ${countRowsCompleted}`);
        console.log(`Info - rows completed: ${countRowsCompleted}\n`);
        countProgressRowsCompleted = 0;
      }
      await delay(sleep_ms);
    } catch (e) {
      console.error(e);
      appendLogFile(logFile, `Error - ${e}`);
    }
  }

  appendLogFile(logFile, `Info - rows completed: ${countRowsCompleted}`);
  console.log(`Info - rows completed: ${countRowsCompleted}\n`);

  let nowDate = new Date();
  const cf_output_old_csv =
    cf_input_csv.replace('.csv', '') +
    '_output_' +
    nowDate.getFullYear() +
    nowDate.getMonth() +
    nowDate.getDay() +
    nowDate.getHours() +
    nowDate.getMinutes() +
    nowDate.getSeconds() +
    '.csv';

  if (fs.existsSync(cf_output_csv)) {
    fs.copyFileSync(cf_output_csv, cf_output_old_csv);
    fs.unlinkSync(cf_output_csv);
  }

  fs.copyFileSync(cf_working_csv, cf_output_csv);
  fs.unlinkSync(cf_working_csv);

  endLogFile(logFile);
}

main().catch((error) => {
  console.error(error);
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get profile user identified by his/her fiscal code.
async function getProfile(fiscal_code: string, subscription_key: string) {
  let body = {
    fiscal_code: fiscal_code,
  };
  const rawResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': subscription_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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
