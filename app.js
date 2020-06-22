const express = require('express');
const bodyparser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// using bodyparses like we previously did
// means we are expecting to handle application/x-www-form-urlencoded requests
// app.use(bodyparser.urlencoded());

// this however means we are expecting to handle application/json requests
// this is how we must do it when working with rest apis
app.use(bodyparser.json());

app.use('/feed', feedRoutes);

app.listen(8080);