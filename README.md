# calculo-frete-com-cep

# 📦 **Calculadora de Frete por CEP**

Um serviço simples e eficiente para calcular o custo de frete entre dois CEPs no Brasil. Este projeto utiliza as APIs **ViaCEP** e **OpenCage** para obter informações de localização e coordenadas geográficas, e a biblioteca **Turf.js** para calcular a distância entre os pontos.

---

## 🚀 **Funcionalidades**

- **Validação e formatação de CEP**: Verifica se o CEP está no formato correto e o formata.
- **Busca de localização**: Obtém o endereço e as coordenadas (latitude e longitude) de um CEP.
- **Cálculo de distância**: Calcula a distância em quilômetros entre dois CEPs.
- **Cálculo de frete**: Define o custo do frete com base na distância.

---

## 📋 **Pré-requisitos**

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
- Uma chave de API do [OpenCage](https://opencagedata.com/) (grátis para uso limitado até 2500 requisições por dia)

---

## 🛠️ **Instalação**

Siga os passos abaixo para configurar o projeto:

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/calculo-frete-com-cep.git
   cd calculo-frete-com-cep
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto e adicione sua chave da API OpenCage:

   ```env
   OPENCAGE_API_KEY=sua_chave_aqui
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

---

## 🎯 **Como Usar**

### **1. Health Check**

Verifique se o servidor está funcionando:

```
GET http://localhost:3001/health
```

**Resposta**:

```json
"OK"
```

---

### **2. Calcular Frete**

Calcule o frete entre dois CEPs:

```
GET http://localhost:3001/calcular-frete?originCep=00000000&destinationCep=11111111
```

**Parâmetros**:

- `originCep`: CEP de origem (formato: `00000000` ou `00000-000`).
- `destinationCep`: CEP de destino (formato: `00000000` ou `00000-000`).

**Resposta**:

```json
{
  "origin": {
    "cep": "00000-000",
    "lat": -23.5505,
    "lng": -46.6333,
    "display_name": "Rua Exemplo, Bairro Exemplo, São Paulo - SP, 00000-000"
  },
  "destination": {
    "cep": "11111-111",
    "lat": -22.9068,
    "lng": -43.1729,
    "display_name": "Rua Destino, Bairro Destino, Rio de Janeiro - RJ, 11111-111"
  },
  "distance": 358.45,
  "cost": 666.9
}
```

---

## 🧠 **Funcionamento Interno**

### **Fluxo do Código**

1. **Validação do CEP**: O CEP é validado e formatado.
2. **Busca de Localização**:
   - O endereço é obtido usando a API **ViaCEP**.
   - As coordenadas (latitude e longitude) são obtidas usando a API **OpenCage**.
3. **Cálculo de Distância**: A distância entre os dois pontos é calculada usando a biblioteca **Turf.js**.
4. **Cálculo de Frete**: O custo do frete é calculado com base na distância.

---

## 📂 **Estrutura do Projeto**

```
calculadora-frete-cep/
├── .env                  # Variáveis de ambiente
├── app.js                # Código principal do servidor
├── package.json          # Dependências e scripts
├── README.md             # Documentação do projeto
└── node_modules/         # Dependências instaladas
```

---

## 🛑 **Possíveis Erros**

- **CEP inválido**: Retorna status `400` com a mensagem `"CEP de origem inválido"` ou `"CEP de destino inválido"`.
- **CEP não encontrado**: Retorna status `500` com a mensagem `"CEP não encontrado"`.
- **Erro na API OpenCage**: Retorna status `500` com a mensagem `"Não foi possível encontrar as coordenadas para este CEP"`.

---

## 🛠️ **Tecnologias Utilizadas**

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Turf.js](https://turfjs.org/) (para cálculos geográficos)
- [ViaCEP](https://viacep.com.br/) (API de CEP)
- [OpenCage](https://opencagedata.com/) (API de geocodificação)
- [dotenv](https://www.npmjs.com/package/dotenv) (gerenciamento de variáveis de ambiente)

---

## 🤝 **Contribuição**

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Faça um push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

---

## ✉️ **Contato**

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato:

- **Autores**: Pedro Gabriel Modesto e Vitor Galvão Mezzomo
- **Email**: pedrogabrielmodesto@gmail.com e vitorgmezz@gmail.com
- **GitHub**: [Pedro Modesto](https://github.com/JKLModesto) e [vitormezz](https://github.com/vitormezz)
