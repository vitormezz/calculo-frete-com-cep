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

const formatCep = (cep) => {
  const digits = cep.replace(/\D/g, "");
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};

const isValidCep = (cep) => {
  return /^\d{5}-?\d{3}$/.test(cep);
};
