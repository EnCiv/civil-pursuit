Synaccord Web Application
---

```
         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac   

```

---

# Install

```bash
git clone https://bitbucket.org/synaccord/democratysings
cd democratysings
npm install
```

# Environment

Before you start the app, you need to set the environment variables. Follow the instructions disclosed in file [export.example.sh](export.example.sh). Below is a list of the required variables:

- **MONGOHQ_URL** The URL of the MongoDB server (*if this is not set, it will connect to localhost at MongoDB's default industry port*)
- **PORT** The HTTP server port (*3000 if not set*)
- **SYNAPP_ENV** *experimental* The name of the instance (ie, `synappalpha`)
- **SYNAPP_SELENIUM_TARGET** The URL to run tests to (ie, `http://democracysin.gs`)

# Start

```bash
. export.sh # the file with the environment variables
npm start
```

# Server instances

Technical constraints (like the Facebook app) lead us to put names to our various environments:

- **alpha**
- **beta**
- **prod**

# Database

We use MongoDB for the storage. The address of the MongoDB server is provided to the application via the `MONGOHQ_URL` environment.

## Database server

We use Compose (ex MongoHQ) for storage. We use it as a Heroku plugin.

## Database

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
node app/bin/test test # Run all test
``` 

