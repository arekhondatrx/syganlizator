const express = require('express');
const path = require('path');
const retry = require('retryer');

const changeState = require('./routes/changeState');
const sender = require('./serverAccessLayer')
const config = require('./configReader').getConfig();

const maxPort = config.server.maxPort;
const minPort = config.server.minPort;

const app = express();
let port = process.argv.slice(2)[0];
port = port ? port : Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
let id = process.argv.slice(2)[1];
id = id ? id : port;

const url = `http://localhost:${port}`;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', changeState);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

const body = {id, url}

retry.default(() => sender.sendData(body, config.driver.url), config.retryOption)
                      .then(result => console.log(`Response: ${JSON.stringify(result)}`))
                      .catch(err => console.log(`${err}`));
