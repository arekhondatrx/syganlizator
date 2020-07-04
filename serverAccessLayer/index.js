'use strict';

const request = require('request');

function sendData(body, serverUrl) {
    const options = {  url: serverUrl, body, json: true };
    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                resolve({status: response.statusCode, body});
            }
        });
    });
}

module.exports = {
    sendData
};