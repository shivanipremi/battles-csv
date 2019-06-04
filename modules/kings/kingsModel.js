'use strict'

// require mongoose library
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kings = new Schema({
    name:{type: String, required:true},
    total_wars : {type : Number, default : 0},
    wins_as_attacker:{type: Number, default : 0},
    wins_as_defender: { type: Number, default : 0},
    lost_as_attacker:{ type: Number, default : 0},
    lost_as_defender : { type: Number, default : 0},
    war_as_attacker : { type: Number, default : 0},
    war_as_defender : { type: Number, default : 0},
}, {
    timestamps: true
});

module.exports = mongoose.model('kings', kings);
