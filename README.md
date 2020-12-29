# IO-BULKMESSAGES

### run

```bash
yarn install
yarn build
cp .env.exsample .env
yarn ts-node src/send-messages work/sample.csv work/sample_skip.csv
```

### sample .env file

```bash
API_URL="https://api.io.italia.it/api/v1/messages"
SUBSCRIPTION_KEY="XXX"
SLEEP_MS="100"
SLEEP429_MS="1000"
# One of: cashbackIBAN1, cashbackIBAN2, bonusvacanzeStart1
MESSAGE_CONTENT="XXX"
```
