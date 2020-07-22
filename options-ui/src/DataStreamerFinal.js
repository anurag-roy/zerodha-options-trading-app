import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import SelectedStock from "./SelectedStock";
import { Grid } from "@material-ui/core";

const ENDPOINT = "http://127.0.0.1:5000";

const useStyles = makeStyles({
  root: {
    minWidth: 300,
  },
  title: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 14,
  },
});

function DataStreamerFinal({ stockA, stockB, tokenA, tokenB, aEntryPrice, bEntryPrice }) {
  console.log("Given Entry Prices: ", aEntryPrice, bEntryPrice);
  const [stockAPrice, setStockAPrice] = useState(0);
  const [stockBPrice, setStockBPrice] = useState(0);

  const classes = useStyles();

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
  }, []);

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
        <Grid item>
          <SelectedStock input={"A"} data={stockA} /> <br />
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {stockA.tradingsymbol}
              </Typography>
              <Typography variant="h5" component="h2">
                Entered Price: {aEntryPrice}
              </Typography>
              <Typography variant="h5" component="h2">
                Avg Price: {stockAPrice}
              </Typography>
              <Typography variant="h5" component="h2">
                {stockA.instrument_type} Spread:{" "}
                {stockA.instrument_type === "CE"
                  ? stockA.strike + aEntryPrice
                  : stockA.strike - aEntryPrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <SelectedStock input={"B"} data={stockB} /> <br />
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {stockB.tradingsymbol}
              </Typography>
              <Typography variant="h5" component="h2">
                Entered Price: {bEntryPrice}
              </Typography>
              <Typography variant="h5" component="h2">
                Avg Price: {stockBPrice}
              </Typography>
              <Typography variant="h5" component="h2">
                {stockB.instrument_type} Spread:{" "}
                {stockB.instrument_type === "CE"
                  ? stockB.strike + bEntryPrice
                  : stockB.strike - bEntryPrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default DataStreamerFinal;
