Synaccord Web Application
---

# Download

```bash
git clone https://bitbucket.org/francoisvespa/synaccord-web-application
cd synaccord-web-application
```

# Environment

Before you start the app, you need to set the environment variables. Follow the instructions disclosed in file [export.example.sh](export.example.sh). You should then have a file `export.sh`. Source it from terminal:

```bash
source export.sh
```

**You will need to source it everytime you install or start the app**.

# Install

```bash
npm install
```

# Start

```bash
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
