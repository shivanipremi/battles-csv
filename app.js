
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
    try{
    if (req.path == '/api/register_user' || req.path == '/api/auth/signin') return next();
    if(!req.headers.authorization) return res.send({status : 400, error : 'Authorization is required'})
    const token = req.headers.authorization.split(" ")[1]
   let payload = await jwt.verify(token, key.tokenKey) 
        if (payload) {
            let data = await user.findById(payload.userId)
            if(data) {
                req.user=data;
                    next()
            } else {
                next();
            } 
        } else {
           next()
        }
    
}catch(e){
    next()
}
})

const startServer =  http.createServer(app).listen(app.get('port'), function () {
    console.log('Server connected on port :', app.get('port'))
    startInitialProcess();
});

require('./index')
async function startInitialProcess() {
// mongoose.connect("mongodb://localhost:27017/battles");
// mongoose.connect("mongodb+srv://battles:@cluster0-dkuwq.mongodb.net/test?retryWrites=true&w=majority"
//    )
mongoose.connect("mongodb+srv://battles:meharkri@cluster0-hym5r.mongodb.net/test?retryWrites=true&w=majority")
// mongoose.connect("mongodb+srv://user:meharkri@cluster0-am3sv.mongodb.net/test?retryWrites=true&w=majority", options)
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

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });