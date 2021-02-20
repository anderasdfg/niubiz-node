var express = require('express');
var router = express.Router();
const service = require('../services/niubiz');


/* GET users listing. */
router.get('/', function(req, res, next) {  
  res.send('respond with a resource');
});

router.get('/token/:user/:password', async(req, res) => {
  let credentials = service.encryptCredentials(req.params.user, req.params.password)
  if (credentials) {
    await service.getToken(credentials).
    then(result =>{
      if (!result.code){                
        res.send(result)
      }else{        
        console.log(result);
        res.send(`Something wrong`);        
      }
    }).catch();
  } else{
    let error = {
      code: 500,
      message: `Can't buffer credentials`
    }
    res.send(error);
  }
});

router.get('/aa/:amount/:email/:dni/:user/:password', async(req, res) => {
  res.send('hola crack')
  // let credentials = service.encryptCredentials(req.params.user, req.params.password)
  // let order = {
  //   credentials : credentials,
  //   amount: req.params.amount,
  //   email: req.params.email,
  //   dni : req.params.dni
  // }
  
  //   await service.generateSession(order).
  //   then(result =>{
  //     if (!result.code){                
  //       res.send(result)
  //     }else{        
  //       console.log(result);
  //       res.send(`Something wrong`);        
  //     }
  //   }).catch();    
});


router.get('/sesion/:amount/:email/:dni/:user/:password/:merchantId', async(req, res) => {
   let credentials = service.encryptCredentials(req.params.user, req.params.password);   
  let order = {
    credentials : credentials,
    amount: req.params.amount,
    email: req.params.email,
    dni : req.params.dni,
    merchantId: req.params.merchantId
  }  
 
    await service.generateSession(order).
    then(result =>{
      console.log(result);
      if (!result.code){                
        res.send(result)
      }else{        
        console.log(result);
        res.send(`Something wrong`);        
      }
    }).catch();    
});

module.exports = router;
