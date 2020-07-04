const cors = require("cors");
const express = require("express");
const app = express();
const mapperRouter = require("./mapper");

app.use(cors());
app.use(express.json());

app.use("/mapper", mapperRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port number ${port}`);
});
