'use strict';

var _child_process = require('child_process');

var env = process.env;

env.PORT = 4012;
env.NODE_ENV = 'production';

console.log('env', env);

var ps = (0, _child_process.spawn)('node', ['dist/bin/start'], { env: env });

ps.stdout.on('data', function (data) {
  return console.log(data.toString());
});
ps.stderr.on('data', function (data) {
  return console.log(data.toString());
});