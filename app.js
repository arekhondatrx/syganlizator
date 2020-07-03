const express = require('express');
const path = require('path');
const changeState = require('./routes/changeState');
const sender = require('./serverAccessLayer')

const maxPort = 40000;
const minPort = 3000;

const app = express();
const port = process.argv.slice(2)[0] | Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
const id = process.argv.slice(2)[1] | port
const url = `http://localhost:${port}`;
const serverUrl = 'http://localhost:2000'; // do configu

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', changeState);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

const body = {id, url}
sender.sendData(body, serverUrl)
    .then(result => console.log(`Response: ${JSON.stringify(result)}`))
    .catch(err => console.log(`${err}`));
