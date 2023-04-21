'use strict';

import { spawn } from 'child_process';

let env = process.env;

env.PORT = 4012;
env.NODE_ENV = 'production';

console.log('env', env)

let ps = spawn('node', ['dist/server/start'], { env: env });

ps.stdout.on('data', data => console.log(data.toString()));
ps.stderr.on('data', data => console.log(data.toString()));
