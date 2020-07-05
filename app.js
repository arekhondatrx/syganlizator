const WsClient = require('websocket').client;
const client = new WsClient();
const config = require('./configReader').getConfig();

const maxPort = config.server.maxPort;
const minPort = config.server.minPort;

let port = process.argv.slice(2)[0];
port = port ? port : Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
let id = process.argv.slice(2)[1];
id = id ? id : port;

const url = `http://localhost:${port}`;
const body = {id, url}

client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});

client.onopen = () => {}

client.on('connect', (connection) => {
  console.log('Connected to driver');
  connection.on('error', function(error) {
    console.log(`Connection Error: ${error.toString()}`);
  });
  connection.on('close', function() {
    console.log('Connection Closed');
  });
  connection.on('message', function(message) {
      console.log(`State: ${message.utf8Data}`);
  });

  function send() {
    if (connection.connected) {
      connection.sendUTF(JSON.stringify(body));
    }
  }
  send();
});

client.connect(config.driver.url, null, url);