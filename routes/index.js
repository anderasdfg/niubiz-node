var express = require("express");
const { desencryptObject } = require("../services/niubiz");


var router = express.Router();
const service = require("../services/niubiz");

var tokenSession;

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
        console.log(result);
        res.send(result);
      } else {
        console.log(result);
        res.send(`Something wrong`);
      }
    })
    .catch();
});

module.exports = router;
