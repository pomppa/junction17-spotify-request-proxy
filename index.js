var express = require('express');
var app = express();
var env = require('node-env-file');
var requestProxy = require('express-request-proxy');
var request = require('request');

if(process.env.NODE_ENV !== "production") {
    env(__dirname + '/.env');
}

const BASE64_ENC = process.env.BASE64_ENC;
const PORT = process.env.PORT;

var proxyObject = {
    url: "https://api.spotify.com/v1/:resource/:id",
    headers: {
        'Authorization': 'Bearer ' + token
    },
    json: true
};

/* start listening */
app.listen(PORT, function () {
    console.log('listening');
    getToken();
});

app.get('/', function(req, res) {
    res.send("hello world");
});

/* options to obtain bearer */
var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + BASE64_ENC
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

function getToken() {
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            proxyObject.headers.Authorization = 'Bearer ' + body.access_token;
            setTimeout(getToken, 1800000);
        }
    });
}

app.get('/api/:resource/:id', requestProxy(proxyObject));