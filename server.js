const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
// var serveIndex = require('serve-index')
//local
const api = require('./api');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

// app.use('/.well-known/acme-challenge/', express.static('../.well-known/acme-challenge/'), serveIndex('../.well-known/acme-challenge/', {'icons': true}))
app.use(cors());

app.use(express.json());

app.use(api);

app.listen(4020, () => {
  console.log(`Server is running port 4020 ...`);
});
