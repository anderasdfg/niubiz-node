const axios = require("axios");
const {
  APIToken,
  APISession,
  urlJs,
  timeoutUrl,
  APIEcommerce,
} = require("config").get("niubiz");

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
  getBoton: async (order) => {
    var response = await getBoton(order).catch();
    return response;
  },
  sendAuthorization: async(payment) => {
    var response = await sendAuthorization(payment).catch();
    return response;
  },
  desencryptObject: (data) => {
    var obj = desencryptObject(data);
    return obj;
  }
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
    },
    channel: "web",
    recurrenceMaxAmount: null,
  };

  var response = await axios
    .post(`${APISession}${order.merchantId}`, body, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
    .catch((err) => err.response);
  
  let session = {
    sessionKey: response.data.sessionKey,
    token: token,
    order: order    
  }
  
  return session;
}

async function getBoton(order) {
  let session = await generateSession(order).catch();
  
  const sessionKey = session.sessionKey;
  let payment64 = encryptObject(session);

  var result = `
  <main>
  <div class='loader linkid'></div> 
  <p>Espere un momento por favor...</p>       
  <div id='linkid' class='linkid'>        
      <form name='myForm' class="center" id='myForm' action='/responsevisa/${order.purchaseNumber}/${payment64}' method='post'>
          <script src='${urlJs}'
          data-sessiontoken='${sessionKey}'
          data-channel='web'
          data-merchantid='${order.merchantId}'
          data-merchantlogo='https://www.lolimsa.com.pe/wp-content/uploads/2018/09/qullana.png'
          data-formbuttoncolor='#D80000'
          data-purchasenumber='${order.purchaseNumber}'
          data-amount='${order.amount}'
          data-expirationminutes='5'
          data-timeouturl = '${timeoutUrl}'>
          </script>
      </form>
  </div>
  </main>
  <script>
  submitform();
  
  function submitform()
  {     
    document.getElementById("linkid").style.display = "none";     
    var y = document.getElementsByClassName("start-js-btn modal-opener default");
    var aNode = y[0].click(); 
  }
  </script>
  <style>main{display:grid;place-items:center}.loader{border:16px solid #f3f3f3;border-top:16px solid #3498db;border-radius:50%;width:120px;height:120px;animation:spin 2s linear infinite;margin:30vh auto 0 auto}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>`;

  return result;
}

async function sendAuthorization(payment){  
  let body = {
    antifraud: null,
    captureType: "manual",
    channel: "web",
    countable: true,
    order: {
        amount: payment.amount,
        currency: "PEN",
        purchaseNumber: payment.purchaseNumber,
        tokenId: payment.tokenId,
    },
    terminalId: "1",
    terminalUnattended: false,
};

  var response = await axios
    .post( `${APIEcommerce}${payment.merchantId}`, body, {
      headers: {
        Authorization: payment.token,
        "Content-Type": "application/json",
      },
    })
    .catch((err) => err.response.data);
  return response;
}

function encryptObject(data) {
  let objJsonStr = JSON.stringify(data);
  let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return objJsonB64;
}

function desencryptObject(data) {  
  let objJsonStr  = Buffer.from(data, "base64").toString("ascii");  
  return objJsonStr;
}