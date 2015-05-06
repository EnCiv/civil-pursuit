Synaccord Web Application
=========================

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

# Install

```bash
git clone https://bitbucket.org/synaccord/democratysings
cd democratysings
npm install
```

# Start

```bash
. export.sh
npm start
```

# Database

We use MongoDB for the storage. The address of the MongoDB server is provided to the application via the `MONGOHQ_URL` environment.

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

