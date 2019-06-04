

const controller = require('./userController');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

  
app.post('/api/register_user',controller.register_user); 
app.post('/api/auth/signin', controller.login_user)




