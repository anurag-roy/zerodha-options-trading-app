import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";

function DataStreamer({ tokenA, tokenB }) {
  const [stockAPrice, setStockAPrice] = useState(0);
  const [stockBPrice, setStockBPrice] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromKiteTicker", (data) => {
      const response = JSON.parse(data);
      // console.log(response);
      response.forEach((t) => {
        if (t.instrument_token == tokenA) {
          setStockAPrice(t.depth.buy[1].price);
        } else if (t.instrument_token == tokenB) {
          setStockBPrice(t.depth.buy[1].price);
        } else {
          console.log("Unidentified stock data received.");
        }
      });
    });
  });

  return (
    <div>
      Stock A Price: {stockAPrice} <br />
      Stock B Price: {stockBPrice} <br />
      Premium: {stockAPrice + stockBPrice}
    </div>
  );
}

export default DataStreamer;
