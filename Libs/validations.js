
const Joi = require('joi');
const Boom = require('boom')


function validateJoi(dataSet, schemaSet) {
    const validation = Joi.validate(dataSet, schemaSet);
    if (validation.error) {
        let customErrorMessage = validation.error.details[0].message;
        customErrorMessage = customErrorMessage.replace(/"/g, '');
        customErrorMessage = customErrorMessage.replace('[', '');
        customErrorMessage = customErrorMessage.replace(']', '');
        throw Boom.badData(customErrorMessage);
    } else {
        return true
    }

}
module.exports.validateJoi = validateJoi;