const express = require('express');
const path = require('path');
const index = require('./routes/changeState');

const app = express();
const port = 3000;

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
