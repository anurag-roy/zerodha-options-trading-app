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

function DataStreamer({ stockA, stockB, tokenA, tokenB }) {
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
                Live Price <br />
                {stockA.tradingsymbol}
              </Typography>
              <Typography variant="h5" component="h2">
                {stockAPrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <SelectedStock input={"B"} data={stockB} /> <br />
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Live Price <br />
                {stockB.tradingsymbol}
              </Typography>
              <Typography variant="h5" component="h2">
                {stockBPrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
        <Grid item>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Premium
              </Typography>
              <Typography variant="h5" component="h2">
                {stockAPrice + stockBPrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default DataStreamer;
