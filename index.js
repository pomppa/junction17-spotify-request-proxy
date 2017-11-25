var express = require('express');
var app = express();
var env = require('node-env-file');
var requestProxy = require('express-request-proxy');

if(process.env.NODE_ENV !== "production") {
    env(__dirname + '/.env');
}

app.get('/api/:resource/:id', requestProxy({
    url: "https://someapi.com/api/:resource/:id",
    query: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    },
    headers: {
        'X-Custom-Header': process.env.SOMEAPI_CUSTOM_HEADER
    }
}));

console.log('running');
