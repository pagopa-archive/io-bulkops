import * as parsecsv from "csv-parse/lib/sync";
import * as fs from "fs";
import { checkCgnRequirements } from "./utils/date_check";

enum CSV {
  fiscal_code = "fiscal_code"
}

async function main() {
  let output_cf_csv = "";
  let input_cf_csv = "";
  let cf_items = undefined;

  if (process.argv.length > 2) {
    output_cf_csv = String(process.argv[2]);
  } else {
    // tslint:disable-next-line: no-console
    console.error("You need to specify input csv");
    return;
  }

  if (process.argv.length > 3) {
    input_cf_csv = String(process.argv[3]);
  } else {
    // tslint:disable-next-line: no-console
    console.error("You need to specify input cf csv");
    return;
  }

  if (fs.existsSync(input_cf_csv)) {
    // File exists in path
    const cfFile = fs.readFileSync(input_cf_csv).toString();
    cf_items = parsecsv(cfFile, {
      columns: true,
      skip_empty_lines: true
    });
  } else {
    // File doesn't exist in path
    // tslint:disable-next-line: no-console
    console.error(input_cf_csv + " file not found");
    return;
  }

  // tslint:disable-next-line: no-let
  let count = 0;
  // tslint:disable-next-line: no-console
  console.log(`cf: ${cf_items.length}`);
  // tslint:disable-next-line: no-console

  // send messages
  for (const cf of cf_items) {
    if (count === 0) {
      // begin file
      fs.writeFileSync(output_cf_csv, CSV.fiscal_code + "\n");
    }
    if (checkCgnRequirements(String(cf)).isRight()) {
      // save cf
      fs.writeFileSync(output_cf_csv, `${cf.fiscal_code} \n`, { flag: "a+" });
    }
    count = count + 1;
  }
}

main().catch(error => {
  // tslint:disable-next-line: no-console
  console.error(error);
});
