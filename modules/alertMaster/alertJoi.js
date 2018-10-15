const add_item = Joi.object().keys({
    alert_title: Joi.string().required(),
    query_type: Joi.string().optional(),
    observer: Joi.string().required(),
    to_mail: Joi.string().optional(),
    to_mobile: Joi.string().required()
});

module.exports.add_item = add_item