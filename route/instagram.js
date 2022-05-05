module.exports = (app) =>{
 const { getAllMediaData ,getAuthCode } = require('../controller/instagram');
 app.get('/api/instagram/getMedia',getAllMediaData)
 app.get('/api/get-auth-code',getAuthCode)
}