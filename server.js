// Importação das bibliotecas necessárias
const express = require("express"); // Framework para criar o servidor HTTP
const { distance } = require("@turf/turf"); // Biblioteca para cálculos geográficos
const dotenv = require("dotenv"); // Biblioteca para carregar variáveis de ambiente
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

// Inicialização do Express
const app = express();
app.use(express.json()); // Middleware para processar requisições com JSON

/**
 * Formata um CEP para o padrão brasileiro (XXXXX-XXX).
 * Remove caracteres não numéricos e adiciona o hífen, se necessário.
 * @param {string} cep - O CEP a ser formatado.
 * @returns {string} - O CEP formatado.
 */
const formatCep = (cep) => {
  const digits = cep.replace(/\D/g, ""); // Remove todos os não dígitos
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};

/**
 * Valida se um CEP está no formato correto (XXXXX-XXX ou XXXXXXXX).
 * @param {string} cep - O CEP a ser validado.
 * @returns {boolean} - True se o CEP for válido, False caso contrário.
 */
const isValidCep = (cep) => {
  return /^\d{5}-?\d{3}$/.test(cep);
};

/**
 * Busca a localização (latitude, longitude) de um CEP usando as APIs ViaCEP e OpenCage.
 * @param {string} cep - O CEP a ser consultado.
 * @returns {Object} - Um objeto contendo as informações de localização.
 * @throws {Error} - Lança um erro se o CEP não for encontrado ou as coordenadas não puderem ser obtidas.
 */
const fetchLocationFromCep = async (cep) => {
  const fetch = (await import("node-fetch")).default; // Importação dinâmica do node-fetch
  const cleanCep = cep.replace("-", ""); // Remove o hífen do CEP
  const viaCepResponse = await fetch(
    `https://viacep.com.br/ws/${cleanCep}/json/`
  );
  const viaCepData = await viaCepResponse.json();

  if (viaCepData.erro) {
    throw new Error("CEP não encontrado");
  }

  // Monta o endereço completo para consulta na OpenCage
  const address = `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}, Brazil`;
  const openCageApiKey = process.env.OPENCAGE_API_KEY; // Chave da API OpenCage
  const openCageResponse = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${openCageApiKey}&countrycode=br`
  );
  const openCageData = await openCageResponse.json();

  if (!openCageData.results || openCageData.results.length === 0) {
    throw new Error("Não foi possível encontrar as coordenadas para este CEP");
  }

  // Retorna as informações de localização
  return {
    cep,
    lat: openCageData.results[0].geometry.lat,
    lng: openCageData.results[0].geometry.lng,
    display_name: `${viaCepData.logradouro}, ${viaCepData.bairro}, ${viaCepData.localidade} - ${viaCepData.uf}, ${viaCepData.cep}`,
  };
};

/**
 * Calcula o custo do frete com base na distância em quilômetros.
 * @param {number} distanceKm - A distância em quilômetros.
 * @returns {number} - O custo do frete.
 */
const calculateShippingCost = (distanceKm) => {
  if (distanceKm <= 10) return 10.0; // Custo fixo para distâncias até 10 km
  if (distanceKm <= 50) return 50.0; // Custo fixo para distâncias até 50 km
  return 50.0 + (distanceKm - 50) * 2.0; // Custo variável para distâncias acima de 50 km
};

// Rota de health check
app.get("/health", (req, res) => {
  res.send("OK"); // Retorna "OK" para indicar que o servidor está funcionando
});

/**
 * Rota para calcular o frete entre dois CEPs.
 * @param {string} originCep - CEP de origem.
 * @param {string} destinationCep - CEP de destino.
 * @returns {Object} - Retorna um objeto com as informações de origem, destino, distância e custo do frete.
 * @throws {Error} - Retorna um erro 400 se os CEPs forem inválidos ou 500 se ocorrer um erro durante o processamento.
 */
app.get("/calcular-frete", async (req, res) => {
  const { originCep, destinationCep } = req.query;

  // Formata e valida os CEPs
  const formattedOriginCep = formatCep(originCep);
  const formattedDestinationCep = formatCep(destinationCep);

  if (!isValidCep(formattedOriginCep)) {
    return res.status(400).json({ error: "CEP de origem inválido" });
  }
  if (!isValidCep(formattedDestinationCep)) {
    return res.status(400).json({ error: "CEP de destino inválido" });
  }

  try {
    // Busca as localizações de origem e destino
    const originLocation = await fetchLocationFromCep(formattedOriginCep);
    const destinationLocation = await fetchLocationFromCep(
      formattedDestinationCep
    );

    // Calcula a distância entre os pontos
    const from = [originLocation.lng, originLocation.lat];
    const to = [destinationLocation.lng, destinationLocation.lat];
    const distanceKm = distance(from, to, { units: "kilometers" });

    // Calcula o custo do frete
    const shippingCost = calculateShippingCost(distanceKm);

    // Retorna a resposta com os dados formatados
    res.send({
      origin: originLocation,
      destination: destinationLocation,
      distance: Math.round(distanceKm * 100) / 100, // Distância arredondada para 2 casas decimais
      cost: Math.round(shippingCost * 100) / 100, // Custo arredondado para 2 casas decimais
    });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Retorna erro 500 em caso de falha
  }
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
