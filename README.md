Synaccord Web Application
---

# Install

```bash
git clone https://bitbucket.org/francoisvespa/synaccord-web-application
cd synaccord-web-application
npm install
```

# Environment

Before you start the app, you need to set the environment variables. Follow the instructions disclosed in file [export.example.sh](export.example.sh). Below is a list of the required variables:

- **MONGOHQ_URL** The URL of the MongoDB server (*if this is not set, it will connect to localhost at MongoDB's default industry port*)
- **PORT** The HTTP server port (*3000 if not set*)
- **SYNAPP_ENV** The name of the instance (ie, `synappalpha`)

# Start

```bash
source export.sh # the file with the environment variables
npm start
```

# NPM commands

- `npm install` - Install app
- `npm start` - Start app
- `npm test` - Run all tests suites
- `npm run transpile` - Transpile ES6/7 ro ES5 (babel)
- `npm run hot-transpile` - Same than transpile, but live
- `npm run build` - Browserify
- `npm run watchify` - Browserify live (with watchify)
- `npm run watch-less` - Convert LESS to css
- `npm run reset` - Empty database then populate it running the migrations
