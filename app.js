
const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const bodyParser = require('body-parser');
config = require('config');


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


global.app = app;


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
