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
import DataStreamerFinal from "./DataStreamerFinal";

const InputForm = () => {
  const [state, setState] = useState("initial");

  const [stockA, setStockA] = useState();
  const [stockB, setStockB] = useState();

  const [quantityA, setQuantityA] = useState(0);
  const [quantityB, setQuantityB] = useState(0);
  const [productType, setProductType] = useState("NRML");

  const [aEntryPrice, setAEntryPrice] = useState(0);
  const [bEntryPrice, setBEntryPrice] = useState(0);

  useEffect(() => {
    if (state === "stocksSelected") {
      axios
        .get("http://localhost:5000/subscribe", {
          params: {
            tokenA: stockA.instrument_token,
            tokenB: stockB.instrument_token,
          },
        })
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    }

    if (state === "stocksOrdered") {
      axios
        .post("http://localhost:5000/enterMarket", {
          stockA,
          stockB,
          quantityA,
          quantityB,
          productType,
          transactionType: "SELL",
        })
        .then(({ data }) => {
          console.log("Entry Price Data: ", data);
          setAEntryPrice(data.aEntryPrice);
          setBEntryPrice(data.bEntryPrice);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [state]);

  const proceedButton = () => {
    if (!stockA || !stockB) {
      alert("Please selected valid stocks. Cannot proceed.");
    } else {
      setState("stocksSelected");
    }
  };

  const confirmButton = () => {
    if (quantityA === 0 || quantityB === 0) {
      alert("Quantity cannot be 0. Cannot proceed.");
    } else {
      setState("stocksOrdered");
    }
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
        <DataStreamer
          stockA={stockA}
          stockB={stockB}
          tokenA={stockA.instrument_token}
          tokenB={stockB.instrument_token}
        />
        <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
          <Grid item>
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
              <InputLabel>Product Type</InputLabel>
              <Select
                id="product-type"
                value={productType}
                onChange={(event) => {
                  setProductType(event.target.value);
                }}
                label="Product Type"
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
              style={{ background: green[600], color: "white" }}
              onClick={confirmButton}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  } else if (state === "stocksOrdered") {
    return (
      <DataStreamerFinal
        stockA={stockA}
        stockB={stockB}
        tokenA={stockA.instrument_token}
        tokenB={stockB.instrument_token}
        aEntryPrice={aEntryPrice}
        bEntryPrice={bEntryPrice}
      />
    );
  }
};

export default InputForm;
