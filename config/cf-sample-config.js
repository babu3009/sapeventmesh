'use strict';

const fs = require('fs');

const packetdata = JSON.stringify({
  "options": {
    "management": true,
    "messagingrest": true,
    "messaging": true
  },
  "emname": "tcomm"
});

module.exports = {
  uri: 'wss://enterprise-messaging-messaging-gateway.cfapps.eu10.hana.ondemand.com/protocols/amqp10ws',
  oa2: {
    endpoint: 'https://tarentobtp.authentication.eu10.hana.ondemand.com/oauth/token',
    client: 'sb-default-78f4c124-7f5e-4e35-8922-5489235294ec-clone!b140765|xbem-service-broker-!b2436',
    secret: '5621341e-f53d-40fb-b46f-73f9d39a7827$o98DL2xKGGjAb37ojwlT-6Sm_4KR_YipuhpVzfAWDY4='
  },
  credentials: {
    mechanism: '',
    user: '',
    password: ''
  },
  data: {
    source: 'queue:tnt/mc001/unq00001/Q1',
    target: 'topic:tnt/mc001/unq00001/QS1',
    payload: new Buffer.allocUnsafe(packetdata.length).fill(packetdata),
    maxCount: 1,
    logCount: 10
  }
};

