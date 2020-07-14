import React from "react";
import InputForm from "./InputForm";

import DataStreamer from "./DataStreamer";

const styles = {
  appInnerContainer: {
    width: "95%",
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
  return (
    <div style={styles.appInnerContainer}>
      <InputForm />
    </div>
  );
};

// const App = () => {
//   return <DataStreamer />;
// };

export default App;
