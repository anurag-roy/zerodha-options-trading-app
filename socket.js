require("dotenv").config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const KiteTicker = require("kiteconnect").KiteTicker;

const ticker = new KiteTicker({
  api_key: process.env.API_KEY,
  access_token: process.env.ACCESS_TOKEN,
});

app.get('/', (req, res) => {
  res.send('Hello');
});

io.on('connection', (socket) => {
  console.log('User connected');

  ticker.connect();

  ticker.on("connect", () => {
    const items = [55963911];
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
  });

  ticker.on("ticks", (ticks) => {
      socket.emit("FromKiteTicker", ticks);
  })
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});