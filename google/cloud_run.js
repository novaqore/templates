const functions = require('@google-cloud/functions-framework');
const express = require('express');
const app = express();

app.get('*', (req, res) => {
  res.send('From Cloud Run! ' + req.path);
});

functions.http('router', app);
