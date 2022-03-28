import * as parsecsv from 'csv-parse/lib/sync';
import * as fs from 'fs';

enum CSV {
  fiscal_code = 'fiscal_code',
  response_code = 'response_code',
  id_message = 'id_message',
}

async function main() {
  let cf_csv = '';
  let cf_skip_csv = '';
  let cf_items = undefined;
  let cf_skip_items = undefined;

  if (process.argv.length > 2) {
    cf_csv = String(process.argv[2]);
  } else {
    // tslint:disable-next-line: no-console
    console.error('You need to specify input csv');
    return;
  }

  if (process.argv.length > 2) {
    cf_skip_csv = String(process.argv[3]);
  } else {
    // tslint:disable-next-line: no-console
    console.error('You need to specify skip csv');
    return;
  }

  if (fs.existsSync(cf_csv)) {
    // File exists in path
    const cf_file = fs.readFileSync(cf_csv).toString();
    cf_items = parsecsv(cf_file, {
      columns: true,
      skip_empty_lines: true,
    });
  } else {
    // File doesn't exist in path
    // tslint:disable-next-line: no-console
    console.error(cf_csv + ' file not found');
    return;
  }

  if (fs.existsSync(cf_skip_csv)) {
    // File exists in path
    const cf_file = fs.readFileSync(cf_skip_csv).toString();
    cf_skip_items = parsecsv(cf_file, {
      columns: true,
      skip_empty_lines: true,
    });
  } else {
    // File doesn't exist in path
    // tslint:disable-next-line: no-console
    console.error(cf_skip_csv + ' file not found');
    return;
  }

  // tslint:disable-next-line: no-console
  console.log(`cf: ${cf_items.length}`);
  console.log(`cf: ${cf_skip_items.length}`);

  if (cf_skip_items != undefined) {
    for (const cf_skip of cf_skip_items) {
      cf_items = cf_items.filter(
        (x: { [x: string]: any }) =>
          x[CSV.fiscal_code] != cf_skip[CSV.fiscal_code]
      );
    }
  }

  const cf_skipped_csv = `${cf_csv.replace('.csv', '')}_skipped.csv`;
  fs.writeFileSync(cf_skipped_csv, CSV.fiscal_code + '\n');

  for (const cf of cf_items) {
    // save cf
    fs.writeFileSync(cf_skipped_csv, `${cf.fiscal_code}\n`, { flag: 'a+' });
  }
}

main().catch((error) => {
  // tslint:disable-next-line: no-console
  console.error(error);
});
