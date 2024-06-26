const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");
const querystring = require("querystring");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
//app.use(express.urlencoded({ extended: true }));

const VITE_APP_BACKEND_URL = "https://api.kraken.com";
const KAN_KEY = process.env.KAN_KEY;
const KAN_SEC = process.env.KAN_SEC;

let nonceNumber = 0;
function createNonce() {
  if (nonceNumber === 9999) nonceNumber = 0;
  let timestamp = new Date().getTime();
  return timestamp + ("0000" + nonceNumber++).slice(-5);
}

function getKrakenSignature(urlPath, data, secret) {
  let encoded;
  if (typeof data === "string") {
    const jsonData = JSON.parse(data);
    encoded = jsonData.nonce + data;
  } else if (typeof data === "object") {
    const dataStr = querystring.stringify(data);
    encoded = data.nonce + dataStr;
  } else {
    throw new Error("Invalid data type");
  }

  const sha256Hash = crypto.createHash("sha256").update(encoded).digest();
  const message = urlPath + sha256Hash.toString("binary");
  const secretBuffer = Buffer.from(secret, "base64");
  const hmac = crypto.createHmac("sha512", secretBuffer);
  hmac.update(message, "binary");
  const signature = hmac.digest("base64");
  return signature;
}

// Route to act as a proxy
app.post("/account-info", async (req, res) => {
  const path = "/0/private/Balance";

  const nonce = createNonce();

  let data = JSON.stringify({
    nonce: nonce,
  });

  const signature = getKrakenSignature(path, data, KAN_SEC);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: VITE_APP_BACKEND_URL + path,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "API-Key": KAN_KEY,
      "API-Sign": signature,
    },
    data: data,
  };

  axios(config)
    .then((response) => {
      res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/withdraw-addresses", async (req, res) => {
  const path = "/0/private/WithdrawAddresses";

  const nonce = createNonce();

  let data = JSON.stringify({
    nonce: nonce,
  });

  const signature = getKrakenSignature(path, data, KAN_SEC);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: VITE_APP_BACKEND_URL + path,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "API-Key": KAN_KEY,
      "API-Sign": signature,
    },
    data: data,
  };

  axios(config)
    .then((response) => {
      res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/trades-history", async (req, res) => {
  const path = "/0/private/TradesHistory";

  const nonce = createNonce();

  let data = JSON.stringify({
    nonce: nonce,
  });

  const signature = getKrakenSignature(path, data, KAN_SEC);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: VITE_APP_BACKEND_URL + path,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "API-Key": KAN_KEY,
      "API-Sign": signature,
    },
    data: data,
  };

  axios(config)
    .then((response) => {
      res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/closed-orders", async (req, res) => {
  const path = "/0/private/ClosedOrders";

  const nonce = createNonce();

  let data = JSON.stringify({
    nonce: nonce,
  });

  const signature = getKrakenSignature(path, data, KAN_SEC);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: VITE_APP_BACKEND_URL + path,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "API-Key": KAN_KEY,
      "API-Sign": signature,
    },
    data: data,
  };

  axios(config)
    .then((response) => {
      res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
