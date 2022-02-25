import * as parsecsv from "csv-parse/lib/sync";
import * as fs from "fs";

enum CSV {
  fiscal_code = "fiscal_code",
  response_code = "response_code",
  id_message = "id_message",
}

async function main() {
  let cf_csv = "";
  let cf_max_count = 0;
  let cf_items = undefined;

  if (process.argv.length > 2) {
    cf_csv = String(process.argv[2]);
  } else {
    // tslint:disable-next-line: no-console
    console.error("You need to specify input csv");
    return;
  }

  if (process.argv.length > 3) {
    cf_max_count = Number(process.argv[3]);
  } else {
    // tslint:disable-next-line: no-console
    console.error("You need to specify max count cf for each csv");
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
    console.error(cf_csv + " file not found");
    return;
  }

  let file_count = 0;
  let count = 0;
  let cf_split_csv = "";
  // tslint:disable-next-line: no-console
  console.log(`cf: ${cf_items.length}`);
  // tslint:disable-next-line: no-console
  console.log(`max cf for file: ${cf_max_count}`);

  // send messages
  for (const cf of cf_items) {
    if (count === 0) {
      // begin file
      cf_split_csv = `${cf_csv.replace(".csv", "")}_splited_${file_count}.csv`;
      fs.writeFileSync(cf_split_csv, CSV.fiscal_code + "\n");
      file_count = file_count + 1;
    }

    // save cf
    fs.writeFileSync(cf_split_csv, `${cf.fiscal_code}\n`, { flag: "a+" });

    count = count + 1;
    if (count === cf_max_count) {
      count = 0;
    }
  }
}

main().catch((error) => {
  // tslint:disable-next-line: no-console
  console.error(error);
});
