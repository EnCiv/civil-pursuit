'use strict';

// import http from 'http';
//
const begin = Date.now();
//
// http.get({
//   hostname : 'example.com',
//   agent : false,
//   pooling : false,
//   gzip: true
// }, res => {
//   console.log((Date.now() - begin) / 1000);
// });


var net = require('net');
var client = net.connect(80, 'www.example.com',
    function() { //'connect' listener
  console.log('connected to server!');
  console.log((Date.now() - begin) / 1000);
  client.write('world!\r\n');
});
client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('disconnected from server');
});
