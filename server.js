// app.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
