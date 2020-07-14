require("dotenv").config();
const KiteTicker = require("kiteconnect").KiteTicker;

const ticker = new KiteTicker({
  api_key: process.env.API_KEY,
  access_token: process.env.ACCESS_TOKEN,
});

ticker.connect();
ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);

function onTicks(ticks) {
  console.log("Ticks", ticks);
}

function subscribe() {
  const items = [11874306, 11874562];
  ticker.subscribe(items);
  ticker.setMode(ticker.modeFull, items);
}
