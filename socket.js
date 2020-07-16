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
  console.log("Subscribe function called");
  tokenA = parseInt(req.query.tokenA);
  tokenB = parseInt(req.query.tokenB);

  console.log("Token A:", tokenA);
  console.log("Token B:", tokenB);

  ticker.connect();

  res.send("Subscribed to the tokens");
});

// Order function
const order = async (stock, transactionType, quantity, product) => {
  // kc.placeOrder("regular", {
  //   exchange: stock.exchange,
  //   tradingsymbol: stock.tradingsymbol,
  //   transaction_type: transactionType,
  //   quantity,
  //   product,
  //   order_type: "MARKET",
  // }).catch((error) => {
  //   console.log("Error while placing order", error);
  // });
  const timestamp = new Date();
  console.log(
    `Order placed for ${stock.exchange}:${stock.tradingsymbol}, Transaction: ${transactionType}, product: ${product}, quantity: ${quantity}`,
  );
  console.log(`Time of order: ${timestamp.toUTCString()}`);

  return `Order placed for ${stock.exchange}:${stock.tradingsymbol}, Transaction: ${transactionType}, product: ${product}, quantity: ${quantity}`;
};

app.post("/enterMarket", async (req, res) => {
  const { stockA, stockB, quantityA, quantityB, productType, transactionType } = req.body;

  const aPromise = order(stockA, transactionType, quantityA, productType);
  const bPromise = order(stockB, transactionType, quantityB, productType);
  await Promise.all([aPromise, bPromise]);

  const positions = await kc.getPositions();
  positionA = positions.net.find((e) => e.tradingsymbol === stockA.tradingsymbol);
  positionB = positions.net.find((e) => e.tradingsymbol === stockB.tradingsymbol);

  res.json({ aEntryPrice: positionA.average_price, bEntryPrice: positionB.average_price });
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
