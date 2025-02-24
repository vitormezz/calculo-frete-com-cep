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

const fetchLocationFromCep = async (cep) => {
  const fetch = (await import("node-fetch")).default;
  const cleanCep = cep.replace("-", "");
  const viaCepResponse = await fetch(
    `https://viacep.com.br/ws/${cleanCep}/json/`
  );
  const viaCepData = await viaCepResponse.json();

  if (viaCepData.erro) {
    throw new Error("CEP não encontrado");
  }

  const address = `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}, Brazil`;
  const openCageApiKey = process.env.OPENCAGE_API_KEY;
  const openCageResponse = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${openCageApiKey}&countrycode=br`
  );
  const openCageData = await openCageResponse.json();

  if (!openCageData.results || openCageData.results.length === 0) {
    throw new Error("Não foi possível encontrar as coordenadas para este CEP");
  }

  return {
    cep,
    lat: openCageData.results[0].geometry.lat,
    lng: openCageData.results[0].geometry.lng,
    display_name: `${viaCepData.logradouro}, ${viaCepData.bairro}, ${viaCepData.localidade} - ${viaCepData.uf}, ${viaCepData.cep}`,
  };
};
const calculateShippingCost = (distanceKm) => {
  if (distanceKm <= 10) return 10.0;
  if (distanceKm <= 50) return 50.0;
  return 50.0 + (distanceKm - 50) * 2.0;
};
