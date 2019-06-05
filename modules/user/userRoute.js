
'use strict';

const controller = require('./userController');
app.post('/api/register_user',controller.register_user); 
app.post('/api/auth/signin', controller.login_user)




