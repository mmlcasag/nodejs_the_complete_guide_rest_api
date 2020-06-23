const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

console.log('Launching the application');

// using bodyparses like we previously did
// means we are expecting to handle application/x-www-form-urlencoded requests
// app.use(bodyparser.urlencoded());

// this however means we are expecting to handle application/json requests
// this is how we must do it when working with rest apis
app.use(bodyparser.json());

// preventing the CORS error
// CORS error occurs everytime we are working with a client and a server on different domains
// so if my server is on localhost:8080 and my client is on localhost:3000
// we will get a CORS error
// this is a security feature checked by the browser in order to prevent cross origin requests
// however, this is exactly what we want to do when dealing with rest apis
// think about it: if you want to use google maps api, you get a response with no errors, right?
// and your application is not hosted along with the google api on the google server, right
// this is because google api set the headers below
// to allow every application to request their api
app.use((req, res, next) => {
    // here we are allowing access to the desired origins
    // you can use *, meaning you are allowing every origin
    // or you could specify localhost:3000 and www.yoursite.com instead, for example
    // if you want to allow more than one origin, just separate them using comma
    res.setHeader('Access-Control-Allow-Origin', '*');
    // here we are allowing access to the desired methods
    // you can use *, meaning you are allowing every method
    // or you could specify only GET and POST methods instead, for example
    // if you want to allow more than one method, just separate them using comma
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    // here we are allowing access to the desired headers
    // you can use *, meaning you are allowing every header
    // you could specify only Content-Type and Authorization headers instead, for example
    // if you want to allow more than one method, just separate them using comma
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
    // finally, you have to call next() so that the request can continue to the following middlewares
    next();
});

app.use('/feed', feedRoutes);

mongoose.connect('mongodb+srv://admin:admin@mmlcasag-cvtew.mongodb.net/udemy-rest-api', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });

// how do we test this?
// well, we can use postman, or insomnia and i will add
// the exported file with the endpoints set up in the tests folder
// and we can also mock a frontent application
// just to test these functionalities
// we will use codepen.io for this
// i will also add the .html and the .js file in the tests folder