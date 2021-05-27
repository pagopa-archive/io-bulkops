# IO-BULKOPS

## Operatiions

- [Get a User Profile using POST](https://developer.io.italia.it/openapi.html#operation/getProfileByPOST)

- [Submit a Message passing the user fiscal_code in the request body](https://developer.io.italia.it/openapi.html#operation/submitMessageforUserWithFiscalCodeInBody)

### run

```bash
yarn install
yarn build
cp .env.example .env

yarn ts-node src/get-profiles work/sample.csv work/sample_skip.csv

yarn ts-node src/send-messages work/sample.csv work/sample_skip.csv
```

### sample .env file

```bash
# API_URL for test https://httpbin.org/anything do not send SUBSCRIPTION_KEY to this url!
API_URL="https://api.io.italia.it/api/v1/messages"
# or
# API_URL="https://api.io.italia.it/api/v1/profiles"
SUBSCRIPTION_KEY="XXX"
SLEEP_MS="10"
SLEEP429_MS="5000"
# One of: cashbackIBAN1, cashbackTransaction1, bonusvacanzeStart1, customMessageUser1, cgnStart1
MESSAGE_CONTENT="XXX"
```
