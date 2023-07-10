'use strict';

// module.exports = require('@sap/xb-msg');
// module.exports = require('@sap/xb-msg-env');
// module.exports = require('@sap/xsenv');

const data = { source: '/topic/a.b.#', maxCount: 100000, logCount: 1000 };
const options = Object.assign({
  // tls : { host : 'localhost', port: 5671 }
  // net : { host : 'localhost', port: 5672 }
  // wss : { host : 'localhost', port: 433, path: '/' }
  // ws  : { host : 'localhost', port: 80, path: '/' }
  // sasl: { user : 'guest', password : 'guest' },
}, (process.argv.length > 2) ? require(process.argv[2]) : {}); options.data = Object.assign(data, options.data);

options.destinations = [{ sample: 'test' }]
// console.log(options)

const { Client } = require('@sap/xb-msg-amqp-v100');
const { ConsumeStatistics } = require('./tools');
const stats = new ConsumeStatistics(options.data.maxCount, options.data.logCount);

const client = new Client(options);
// const msg = require('@sap/xb-msg');
// const client = new msg.Client(options);
const stream = client.receiver('InputA').attach(options.data.source);
var part = "";

stream
  .on('ready', () => {
    console.log('ready');
  })
  .on('data', (message) => {

    part += message.payload.toString('utf8');
    // console.log('stream data ' + part);
    console.log("entered", stats.onReceive());
    console.log("payload : ", part.toString('utf8'));

    // message.done();
    switch (stats.onReceive()) {
      case stats.COUNT:
        message.done();
        //return;
      case stats.COUNT_LOG:
        console.log("COUNT_LOG",stats.count());
        message.done();
        //return;
      case stats.UNSUBSCRIBE:
        part ="";
        console.log("UNSUBSCRIBE",stats.count());
        message.done();
        //return;
      case stats.COOLDOWN:
        part ="";
        message.done();
        //return;
        
    }
    // return;
    /*
        switch (stats.onReceive()) {
          case stats.COUNT:
            message.done();
            return;
          case stats.COUNT_LOG:
            console.log("COUNT_LOG",stats.count());
            message.done();
            return;
          case stats.UNSUBSCRIBE:
            console.log("UNSUBSCRIBE",stats.count());
            message.done();
            client.disconnect();
            return;
          case stats.COOLDOWN:
            message.done();
            return;
            
        }
        */
  }).on('end', function () {
    console.log("payload : ", JSON.parse(part.toString('utf8')));
  })
  .on('finish', () => {
    console.log('finish');
    // console.log("payload : ",JSON.parse(message.payload.toString('utf8')));

    client.disconnect();
  });

client
  .on('connected', (destination, peerInfo) => {
    console.log('connected', peerInfo.description);
  })
  .on('assert', (error) => {
    console.log(error.message);
  })
  .on('error', (error) => {
    console.log(error);
  })
  .on('reconnecting', (destination) => {
    console.log('reconnecting, using destination ' + destination);
  })
  .on('disconnected', (hadError, byBroker, statistics) => {
    console.log('disconnected');
    stats.print(statistics);
  });

client.connect();

