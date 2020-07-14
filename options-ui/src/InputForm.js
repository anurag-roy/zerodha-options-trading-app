import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import StockInputForm from "./StockInputForm";
import SelectedStock from "./SelectedStock";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import axios from "axios";

import DataStreamer from "./DataStreamer";

const InputForm = () => {
  const [state, setState] = useState("initial");

  const [stockA, setStockA] = useState();
  const [stockB, setStockB] = useState();

  const [quantityA, setQuantityA] = useState(0);
  const [quantityB, setQuantityB] = useState(0);
  const [orderType, setOrderType] = useState("NRML");

  useEffect(() => {
    if (state !== "initial") {
      axios
        .get("http://localhost:8000/subscribe", {
          params: {
            tokenA: stockA.instrument_token,
            tokenB: stockB.instrument_token,
          },
        })
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    }
  });

  const proceedButton = () => {
    if (!stockA || !stockB) {
      alert("Please selected valid stocks. Cannot proceed");
    } else {
      setState("stocksSelected");
    }
  };

  const confirmButton = () => {
    console.log("Confirm button clicked");
  };

  if (state === "initial") {
    return (
      <div>
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item>
            <StockInputForm label="A" handleChange={setStockA} />
          </Grid>
          <Grid item>
            <StockInputForm label="B" handleChange={setStockB} />
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item>
            <SelectedStock input={"A"} data={stockA} />
          </Grid>
          <Grid item>
            <SelectedStock input={"B"} data={stockB} />
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              style={{ background: green[600], color: "white" }}
              onClick={proceedButton}
            >
              Proceed
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  } else if (state === "stocksSelected") {
    return (
      <div>
        <DataStreamer tokenA={stockA.instrument_token} tokenB={stockB.instrument_token} />
        <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
          <Grid item>
            <SelectedStock input={"A"} data={stockA} />
            <br />
            <TextField
              id="quantity-a"
              label="Quantity for A"
              variant="outlined"
              value={quantityA}
              onChange={(event) => {
                console.log(event.target.value);
                setQuantityA(event.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <SelectedStock input={"B"} data={stockB} />
            <br />
            <TextField
              id="quantity-b"
              label="Quantity for B"
              variant="outlined"
              value={quantityB}
              onChange={(event) => {
                console.log(event.target.value);
                setQuantityB(event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
          <Grid item>
            <FormControl variant="outlined">
              <InputLabel>Order Type</InputLabel>
              <Select
                id="order-type"
                value={orderType}
                onChange={(event) => {
                  setOrderType(event.target.value);
                }}
                label="Order Type"
                style={{ width: 275 }}
              >
                <MenuItem value={"NRML"}>NRML</MenuItem>
                <MenuItem value={"MIS"}>MIS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              style={{ background: green[800], color: "white" }}
              onClick={confirmButton}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default InputForm;
