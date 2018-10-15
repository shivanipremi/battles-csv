
// performance monitoring with New Relic for live environment
if (process.env.NODE_ENV == 'live') {
    require('newrelic');
}

// Configuration setup with config module
process.env.NODE_CONFIG_DIR = 'config/';

// Moving NODE_APP_INSTANCE aside during configuration loading
var app_instance = process.argv.NODE_APP_INSTANCE;
process.argv.NODE_APP_INSTANCE = "";

config = require('config');

// PMX allows you to create advanced interactions with PM2 and Keymetrics.io

// Moduler dependencies 
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var MongoClient = require('mongodb').MongoClient;
var http = require('http');


var multipartMiddleware = multipart();
process.argv.NODE_APP_INSTANCE = app_instance;

// error tracking with Sentry raven
var client = ''



msSqlLib = require('./Libs/msSqlLib');

var app = express();


app.set('port', process.env.PORT || config.get('PORT'));
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));


app.use(express.static(path.join(__dirname, 'public')));

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


var startServer =  http.createServer(app).listen(app.get('port'), function () {
    console.log('Server connected on port :', app.get('port'))
    startInitialProcess();
});


async function startInitialProcess() {
    setTimeout((async () => {
        console.log('conenction is', connection)
        const result = await connection.query`select * from alertmaster`
        console.dir(result)
    }), 9000);
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
