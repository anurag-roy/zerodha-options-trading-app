/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import axios from "axios";

const styles = {
  appInnerContainer: {
    width: "90%",
    margin: "20px auto 0",
  },
  paper: {
    overflowX: "auto",
  },
  spinner: {
    margin: "20px auto",
    display: "block",
  },
  actionCell: {
    textAlign: "center",
  },
};

const App = () => {
  const [names, setNames] = useState([]);
  const [ceName, setCEName] = useState("");
  const [peName, setPEName] = useState("");
  const [dataForCE, setDataForCE] = useState([]);
  const [dataForPE, setDataForPE] = useState([]);
  const [ceStrikePrice, setCEStrikePrice] = useState("");
  const [peStrikePrice, setPEStrikePrice] = useState("");
  const [ceExpiry, setCEExpiry] = useState("");
  const [peExpiry, setPEExpiry] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/mapper/names").then((result) => {
      setNames(result.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/mapper/byName", { params: { name: ceName } })
      .then((result) => {
        setDataForCE(result.data);
      });
  }, [ceName]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/mapper/byName", { params: { name: peName } })
      .then((result) => {
        setDataForPE(result.data);
      });
  }, [peName]);

  const mapToStrikePrice = (stockArray) => {
    if (stockArray === null) return [];
    let spSet = new Set();
    stockArray.forEach((s) => {
      spSet.add(s.strike.toString());
    });
    return [...spSet];
  };

  const mapToExpiry = (stockArray, name, strikePrice) => {
    if (stockArray === null) return [];
    let expirySet = new Set();
    stockArray
      .filter((s) => s.strike == strikePrice)
      .map((s) => {
        const ts = s.tradingsymbol;
        const tsTrimmed = ts.substr(0, ts.lastIndexOf(strikePrice));
        const expiry = tsTrimmed.slice(name.length);
        if (expiry) expirySet.add(expiry);
      });
    return [...expirySet];
  };

  const stockA = dataForCE.find(d => d.tradingsymbol === `${ceName}${ceExpiry}${ceStrikePrice}CE`);
  // console.log(stockA);

  const stockB = dataForPE.find(d => d.tradingsymbol === `${peName}${peExpiry}${peStrikePrice}PE`);
  // console.log(stockB);

  const SelectedStock = ({input, data}) => {
    if (!data) return <div>Selected Stock {input}: No Valid Stock Selected</div>;

    return (<div>
      Selected Stock {input}: <br/>
      Trading Symbol: {data.tradingsymbol} <br/>
      Name: {data.name} <br/>
      Expiry Data: {data.expiry} <br/>
      Strike Price: {data.strike} <br/>
      Lot Size: {data.lot_size} <br/>
      Instrument Type: {data.instrument_type} <br/>
      Exchange: {data.exchange} <br/>
    </div>);
  }

  return (
    <div style={styles.appInnerContainer}>
      <Autocomplete
        id="ce-name-input"
        onChange={(event, newValue) => {
          console.log("Value for Name:", newValue);
          setCEName(newValue);
        }}
        options={names}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" label="CE Name" />}
      />
      <Autocomplete
        id="ce-sp-input"
        onChange={(event, newValue) => {
          console.log(newValue);
          setCEStrikePrice(newValue);
        }}
        options={mapToStrikePrice(dataForCE)}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" label="Strike Price" />}
      />
      <Autocomplete
        id="ce-expiry-input"
        onChange={(event, newValue) => {
          console.log(newValue);
          setCEExpiry(newValue);
        }}
        options={mapToExpiry(dataForCE, ceName, ceStrikePrice)}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" label="Expiry" />}
      />
      <br />
      <Autocomplete
        id="pe-name-input"
        onChange={(event, newValue) => setPEName(newValue)}
        options={names}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" label="PE Name" />}
      />
      <Autocomplete
        id="pe-sp-input"
        onChange={(event, newValue) => {
          console.log(newValue);
          setPEStrikePrice(newValue);
        }}
        options={mapToStrikePrice(dataForPE)}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" label="Strike Price" />}
      />
      <Autocomplete
        id="pe-expiry-input"
        onChange={(event, newValue) => {
          console.log(newValue);
          setPEExpiry(newValue);
        }}
        options={mapToExpiry(dataForPE, peName, peStrikePrice)}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" label="Expiry" />}
      />
      <br/>
      <SelectedStock input={"A"} data={stockA} /> <br/>
      <SelectedStock input={"B"} data={stockB} />

    </div>
  );

  // const changeExchangeA = (event) => {
  //   setExchangeA(event.target.value);
  // };

  // const changeExchangeB = (event) => {
  //   setExchangeB(event.target.value);
  // };

  // const proceedToTrade = () => {
  //   if (!tsA || !tsB) {
  //     alert("You haven't selected both stocks. Cannot proceed.");
  //   } else {
  //     window.confirm(`You have selected the following stocks:
  //     Stock A - ${exchangeA}:${tsA.tradingSymbol}
  //     Stock B - ${exchangeB}:${tsB.tradingSymbol}
  //     Proceed?`);
  //   }
  // };

  // return (
  //   <div style={styles.appInnerContainer}>
  //     <Grid container spacing={3}>
  //       <Grid item xs={1}>
  //         <h3>Stock A:</h3>
  //       </Grid>
  //       <Grid item xs={1}>
  //         <FormControl variant="outlined">
  //           <InputLabel id="demo-simple-select-outlined-label">Exchange</InputLabel>
  //           <Select
  //             labelId="exchangeA-select-label"
  //             id="exchangeA-select"
  //             value={exchangeA}
  //             onChange={changeExchangeA}
  //             label="Exchange"
  //           >
  //             <MenuItem value={"BSE"}>BSE</MenuItem>
  //             <MenuItem value={"NSE"}>NSE</MenuItem>
  //             <MenuItem value={"NFO"}>NFO</MenuItem>
  //             <MenuItem value={"MCX"}>MCX</MenuItem>
  //           </Select>
  //         </FormControl>
  //       </Grid>
  //       <Grid item xs={3}>
  //         <Autocomplete
  //           value={tsA}
  //           onChange={(event, newValue) => {
  //             setTsA(newValue);
  //           }}
  //           id="stockA-ts-input"
  //           options={dataForA}
  //           getOptionLabel={(option) => option.tradingSymbol}
  //           style={{ width: 300 }}
  //           renderInput={(params) => (
  //             <TextField {...params} variant="outlined" label="Trading Symbol" />
  //           )}
  //         />
  //       </Grid>
  //     </Grid>
  //     <Grid container spacing={3}>
  //       <Grid item xs={1}>
  //         <h3>Stock B:</h3>
  //       </Grid>
  //       <Grid item xs={1}>
  //         <FormControl variant="outlined">
  //           <InputLabel id="demo-simple-select-outlined-label">Exchange</InputLabel>
  //           <Select
  //             labelId="exchangeB-select-label"
  //             id="exchangeB-select"
  //             value={exchangeB}
  //             onChange={changeExchangeB}
  //             label="Exchange"
  //           >
  //             <MenuItem value={"BSE"}>BSE</MenuItem>
  //             <MenuItem value={"NSE"}>NSE</MenuItem>
  //             <MenuItem value={"NFO"}>NFO</MenuItem>
  //             <MenuItem value={"MCX"}>MCX</MenuItem>
  //           </Select>
  //         </FormControl>
  //       </Grid>
  //       <Grid item xs={3}>
  //         <Autocomplete
  //           value={tsB}
  //           onChange={(event, newValue) => {
  //             setTsB(newValue);
  //           }}
  //           id="stockB-ts-input"
  //           options={dataForB}
  //           getOptionLabel={(option) => option.tradingSymbol}
  //           style={{ width: 300 }}
  //           renderInput={(params) => (
  //             <TextField {...params} variant="outlined" label="Trading Symbol" />
  //           )}
  //         />
  //       </Grid>
  //     </Grid>
  //     <br />
  //     <Button variant="contained" color="primary" onClick={proceedToTrade}>
  //       Proceed to Trade
  //     </Button>
  //     <Grid container spacing={3}>
  //       <Grid item xs={3}></Grid>
  //       <Grid item xs={3}></Grid>
  //       <Grid item xs={3}></Grid>
  //     </Grid>
  //   </div>
  // );
};

export default App;
