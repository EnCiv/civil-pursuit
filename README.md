Synaccord Web Application
=========================

- App hosted on heroku (synaccord.heroku.com)
- MongoDB hosted by MongoHQ as an heroku plugin (free plan)
- 1 dyno: WEB

# NPM

- `npm install` - Install app
- `npm start` - Start app
- `npm test` - Run all tests suites

# Test

There are 4 levels of testing:

- Model
- Socket
- Selenium
- HTTP Server

## Test commands

```bash
node app/business/bin/test ls # View all test
``` 

