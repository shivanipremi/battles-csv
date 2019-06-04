'use strict'

// require mongoose library
var mongoose = require('mongoose');
// var CONSTANTS = require('../Config').constants;
var Schema = mongoose.Schema;

var battles = new Schema({
    name:{type: String, unique : true} ,
    year : {type : String},
    battle_number:{type: Number},
    attacker_king: { type: String, trim: true},
    defender_king: {type: String, trim: true},
    attacker_outcome : {type : String},
    battle_type : {type: String},
    major_death : {type: Number},
    major_capture : {type: Number},
    attacker_1 :{type: String},
    attacker_2 :{type: String},
    attacker_3 :{type: String},
    attacker_4 :{type: String},
    defender_1 :{type: String},
    defender_2 :{type: String},
    defender_3 :{type: String},
    defender_4 : {type: String},
    attacker_size : {type: String},
    defender_size : {type: String},
    attacker_commander :{type: String},
    defender_commander : {type: String},
    summer :{type: String},
    location : {type: String},
    region :{type: String},
    note : {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model('battles', battles);


//{type : Number, enum: [CONSTANTS.ATTACKER_OUTCOME.WIN,CONSTANTS.ATTACKER_OUTCOME.LOSS], required: true},