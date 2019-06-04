'use strict'

// require mongoose library
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var region = new Schema({
    name:{type: String, required:true},
    count : {type : Number, default : 0}
}, {
    timestamps: true
});

module.exports = mongoose.model('region', region);
