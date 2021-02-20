module.exports = {
    server: {
        port: 3000,
        domain: 'localhost',
    },    
    niubiz: {
        APIToken: 'https://apitestenv.vnforapps.com/api.security/v1/security',
        APISession: 'https://apitestenv.vnforapps.com/api.ecommerce/v2/ecommerce/token/session/',
        urlJs: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
        APIEcommerce: 'https://apitestenv.vnforapps.com/api.authorization/v3/authorization/ecommerce/',
        return: 'http://localhost:3000',
        qr: 'https://apitestenv.vnforapps.com/api.qr.manager/v1/qr/ascii'
    },
    logger: 'dev'
}