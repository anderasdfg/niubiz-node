module.exports = {
    server: {
        port: 5000,
        domain: 'localhost',
    }, 
    niubiz: {
        APIToken: 'https://apiprod.vnforapps.com/api.security/v1/security',
        APISession: 'https://apiprod.vnforapps.com/api.ecommerce/v2/ecommerce/token/session/',
        urlJs: 'https://static-content.vnforapps.com/v2/js/checkout.js',
        APIEcommerce: 'https://apiprod.vnforapps.com/api.authorization/v3/authorization/ecommerce/',
        returnUrl: 'https://www.visa.qullanatest.com/niubiz',        
        timeoutUrl: 'https://anderasdfg.github.io/timeout-page/'
    },   
    logger: 'dev'
}