var express = require("express");
var router = express.Router();
const service = require("../services/niubiz");
const helpers = require("../util/helpers");
const { returnLink } = require("config").get("niubiz");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/token/:user/:password", async (req, res) => {
  let credentials = service.encryptCredentials(
    req.params.user,
    req.params.password
  );
  if (credentials) {
    await service
      .getToken(credentials)
      .then((result) => {
        if (!result.code) {
          res.send(result);
        } else {
          console.log(result);
          res.send(`Something wrong`);
        }
      })
      .catch();
  } else {
    let error = {
      code: 500,
      message: `Can't buffer credentials`,
    };
    res.send(error);
  }
});

router.get(
  "/sesion/:amount/:email/:dni/:user/:password/:merchantId",
  async (req, res) => {
    let credentials = service.encryptCredentials(
      req.params.user,
      req.params.password
    );
    let order = {
      credentials: credentials,
      amount: req.params.amount,
      email: req.params.email,
      dni: req.params.dni,
      merchantId: req.params.merchantId,
    };

    await service
      .generateSession(order)
      .then((result) => {
        console.log(result);
        if (!result.code) {
          res.send(result);
        } else {
          console.log(result);
          res.send(`Something wrong`);
        }
      })
      .catch();
  }
);

router.get("/infovisa", async (req, res) => {
  console.log(req.query.data);
  let data64 = req.query.data;
  let dataStr = service.desencryptObject(data64);
  let part = dataStr.split("|");

  let credentials = service.encryptCredentials(part[1], part[2]);
  let order = {
    credentials: credentials,
    amount: part[8],
    email: part[9],
    dni: part[10],
    merchantId: part[3],
    purchaseNumber: part[4],
  };

  await service
    .getBoton(order)
    .then((result) => {
      if (!result.code) {
        res.send(result);
      } else {
        console.log(result);
        res.send(`Something wrong`);
      }
    })
    .catch();
});

router.get(
  "/boton/:amount/:email/:dni/:user/:password/:merchantId/:purchaseNumber",
  async (req, res) => {
    let credentials = service.encryptCredentials(
      req.params.user,
      req.params.password
    );
    let order = {
      credentials: credentials,
      amount: req.params.amount,
      email: req.params.email,
      dni: req.params.dni,
      merchantId: req.params.merchantId,
      purchaseNumber: req.params.purchaseNumber,
    };

    await service
      .getBoton(order)
      .then((result) => {
        if (!result.code) {
          res.send(result);
        } else {
          console.log(result);
          res.send(`Something wrong`);
        }
      })
      .catch();
  }
);

router.post("/responsevisa/:purchaseNumber/:payment", async (req, res) => {
  let objPayment = JSON.parse(service.desencryptObject(req.params.payment));

  let payment = {
    purchaseNumber: req.params.purchaseNumber,
    tokenId: req.body.transactionToken,
    token: objPayment.token,
    amount: objPayment.order.amount,
    merchantId: objPayment.order.merchantId,
  };

  await service
    .sendAuthorization(payment)
    .then((result) => {
      if (!result.code) {
        if (result.data) {
          if (result.data.order) {
            console.log("Pago exitoso");
            let content = contentSucces(result.data);
            let toSend = responsePayment("exitoso", content);
            res.send(toSend);
          } else {
            console.log("Pago no procesado");
            let content = contentFailed(result);
            let toSend = responsePayment("rechazado", content);
            res.send(toSend);
          }
        } else {
          console.log("Pago no procesado[verificar JSON]");
          res.send(result);
        }
      } else {
        console.log(result);
        res.send(`Something wrong`);
      }
    })
    .catch();
});

const contentSucces = (response) => {
  return (content = `<div class="colums">
  <div class="right">
      <p><b>Orden: </b></p>                            
      <p><b>Tarjeta: </b></p>
      <p><b>Medio de pago: </b></p>
      <p><b>Monto (S/.): </b></p>
      <p><b>Fecha y hora: </b></p>
      <p><b>Descripción: </b></p>
  </div>
  <div class="left">
      <p>${response.order.purchaseNumber}</p>                            
      <p>${response.dataMap.CARD}</p>
      <p>${response.dataMap.BRAND.toUpperCase()}</p>
      <p>${response.dataMap.AMOUNT} </p>
      <p>${helpers.formatDate(response.dataMap.TRANSACTION_DATE)}</p>
      <p>Aprobado</p>
  </div>
</div>`);
};

const contentFailed = (response) => {
  return `<p class="center">Su transacción no fue procesada.</p> ${
    response.data
      ? "<p class='center'>(Código de error: " + response.data.ACTION_CODE + ")"
      : "Operación denegada. Intente nuevamente"
  } </p> <br/> ${
    response.data.ACTION_DESCRIPTION
      ? "<p><b>Descripción: </b>" + response.data.ACTION_DESCRIPTION
      : " "
  } `;
};

const responsePayment = (type, content) => {
  var style = `<style>*{box-sizing:border-box;margin:0;padding:0}html{background-color:#f6f9fc;font-size:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}main{box-sizing:border-box;display:grid;place-items:center;margin:5vh auto 17vh auto;height:60vh}.container{padding:5rem;border-radius:.6rem;border:#2ca2eb .1rem solid}.title{border-radius:.6rem;padding:.6rem;background-color:#2ca2eb;text-align:center;font-weight:700;margin-bottom:2rem;font-size:2rem}P{padding:.3rem;font-weight:400;font-size:1.4rem}.btnBlue{padding:1rem 3rem 1rem 3rem;}.small{padding-top:1rem;text-align:center;font-size:1rem}.colums{column-count:2}.right{text-align:right}.left{text-align:left}.btnBlue{text-decoration:none;align-self:center;text-align:center;background-color:#2ca2eb;border-radius:.6rem;border:0 solid;padding:.6rem;color:#000;cursor:pointer}.btnBlue:hover{background-color:#e1ecf4;color:#2ca2eb}.instruction{margin-bottom:0;padding-bottom:0}.center{padding-top:1rem;text-align:center;}</style>`;
  let response = `<main>
      <div class="container">
          <div>
              <p class="title">Pago ${type}</p>
          </div>
          ${content}
          <div class="small">                                
              <a href="${returnLink}" class="btnBlue" >Finalizar</a>
              <p class="small">
                  <p class="small"><b class="instruction">IMPORTANTE: Presione finalizar para concretar la transacción.</b></p> Esta tienda está autorizada por Visa para realizar transacciones electrónicas.
                  </br>Copyright 2020 <a target="_blank" href="https://www.lolimsa.com.pe/">LOLIMSA</a></p>
          </div>
      </div>
  </main> ${style}`;
  return response;
};

module.exports = router;
