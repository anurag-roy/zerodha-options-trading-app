require("dotenv").config();
const KiteConnect = require("kiteconnect").KiteConnect;

const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN;

const kc = new KiteConnect({
  api_key: apiKey,
});

kc.setAccessToken(accessToken);

// kc.getOrderTrades("1000000000817848")
//   .then((data) => console.log(data))
//   .catch((error) => console.error(error));

kc.getPositions()
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
