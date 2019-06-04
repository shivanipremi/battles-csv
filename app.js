
const express = require('express');
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser');
config = require('config');
key = {
    tokenKey : 'abbcdeferekrjkejr'
}
global.key = key;


const http = require('http');
const app = express();

app.set('port', process.env.PORT || config.get('PORT'));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,access_token, api_key, content-type,versions');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // webVersion header for each request
    // res.setHeader('reversions', config.get('webVersion'));

    next();
});

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const user = require("./modules/user/userModel")

global.app = app;
app.use(async function(req,res,next){
    console.log("in the middleware====")
    try{
    console.log("check request here-=-===", req.headers);
    if(!token) next();
    const token = req.headers.authorization.split(" ")[1]
    console.log("token====--", token)
    console.log("key.token key", key.tokenKey)
   let payload = await jwt.verify(token, key.tokenKey) 
        console.log("payload",payload)
        if (payload) {
            console.log("payload====")
            let data = await user.findById(payload.userId)
            if(data) {
                req.user=data;
                    next()
            } else {
                next();
            } 
        } else {
            console.log("next herer==")
           next()
        }
    
}catch(e){
    console.log("error here==", e)
    next()
}
})


const startServer =  http.createServer(app).listen(app.get('port'), function () {
    console.log('Server connected on port :', app.get('port'))
    startInitialProcess();
});

require('./index')
async function startInitialProcess() {
mongoose.connect("mongodb://localhost:27017/battles");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:::::"));
db.once("open", function callback() {
  console.log("mongoose connection is open");
});
}

process.on('message', function (message) {
    console.log("Received signal : " + message);
    if (message === 'shutdown') {
        startServer.close();
        setTimeout(function () {
            process.exit(0);
        }, 15000);
    }
});
