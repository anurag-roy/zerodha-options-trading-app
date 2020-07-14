require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const mapperRouter = require("./mapper");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const KiteConnect = require("kiteconnect").KiteConnect;
const KiteTicker = require("kiteconnect").KiteTicker;

const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN;

const kc = new KiteConnect({
  api_key: apiKey,
});
kc.setAccessToken(accessToken);

const ticker = new KiteTicker({
  api_key: apiKey,
  access_token: accessToken,
});

app.use(cors());
app.use(express.json());

app.use("/mapper", mapperRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

// app.get("/enterMarket", (req, res) => {});

let tokenA, tokenB;

app.get("/subscribe", (req, res) => {
  tokenA = parseInt(req.query.tokenA);
  tokenB = parseInt(req.query.tokenB);

  ticker.connect();

  res.send("Subscribed");
});

// Order function
const order = (stock, transactionType, quantity, price) => {
  // kc.placeOrder("regular", {
  //   exchange: stock.exchange,
  //   tradingsymbol: stock.tradingsymbol,
  //   transaction_type: transactionType,
  //   quantity,
  //   product: "NRML",
  //   order_type: "MARKET",
  //   // price: price,
  // }).catch((error) => {
  //   console.log("Error while placing order", error);
  // });
  const timestamp = new Date();
  console.log(
    `Order placed for ${stock.exchange}:${stock.tradingsymbol}, Transaction: ${transactionType}, price: ${price}, quantity: ${quantity}`,
  );
  console.log(`Time of order: ${timestamp.toUTCString()}`);
};

app.post("/enterMarket", (req, res) => {
  const orderItems = req.body;
});

io.on("connection", (socket) => {
  console.log("User connected");

  ticker.on("connect", () => {
    console.log("Connecting to Zerodha");
    const items = [];
    items.push(tokenA);
    items.push(tokenB);
    console.log("Subscribing to", items);
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
  });

  ticker.on("ticks", (tick) => {
    socket.emit("FromKiteTicker", JSON.stringify(tick));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

http.listen(8000, () => {
  console.log("listening on *:8000");
});
