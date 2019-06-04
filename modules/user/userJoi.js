
'use strict';

const Joi = require('joi')
const register_user = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
}).required();

const login_user = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
}).required();

module.exports.register_user = register_user
module.exports.login_user = login_user