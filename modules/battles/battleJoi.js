'use strict';

const Joi = require("joi");

const import_csv = Joi.object().keys({
   csv_file :  Joi.any()
                .meta({swaggerType: 'file'})
                .optional()
                .allow('')
                .description('image file'),
                   
});

module.exports.import_csv = import_csv