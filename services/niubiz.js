const axios = require("axios");
const { APIToken, APISession, APIEcommerce } = require("config").get("niubiz");

module.exports = {
  encryptCredentials: (user, password) => {
    let credentials = encryptCredentials(user, password);
    return credentials;
  },

  getToken: async (credentials) => {
    var response = await getToken(credentials).catch();
    return response;
  },

  generateSession: async (order) => {    
    var response = await generateSession(order).catch();
    return response;
  },
};

function encryptCredentials(user, password) {
  let credentials = Buffer.from(`${user}:${password}`).toString("base64");
  return credentials;
}

async function getToken(credentials) {
  var response = await axios
    .post(
      APIToken,
      {},
      {
        headers: { authorization: "Basic " + credentials, Accept: "*/*" },
      }
    )
    .catch((err) => err.response.data);
  return response.data;
}

async function generateSession(order) {
  let token = await getToken(order.credentials).catch();  
  let body = {
    amount: order.amount,
    antifraud: {
      merchantDefineData: {
        MDD4: order.email,
        MDD32: order.dni,
        MDD21: "0",
        MDD75: "REGISTRO",
        MDD77: "1",
        MDD33: "DNI",
      },
      channel: 'WEB',
      recurrenceMaxAmount: null,
    },
  };
  console.log(`${APISession}${order.merchantId}`);
  var response = await axios
    .post(`${APISession}${order.merchantId}`, body, {
      headers: { Authorization: token, "Content-Type": "application/json" },
    })
    .catch((err) => err.response.data);
    console.log(response);
  return response;
}
