Synaccord Web Application
---

[![Circle CI](https://circleci.com/gh/Synaccord/synaccord.svg?style=shield&circle-token=5b337ba4f00eedca75846279350b3ca1c2072d5d)](https://circleci.com/gh/Synaccord/synaccord) [![Gitter](https://badges.gitter.im/Synaccord/synaccord.svg)](https://gitter.im/Synaccord/synaccord?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

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

# Directory Structure
- app/api
	The files in this directory are collected up by app/api.js and executed based on events
- app/lib/proptypes
	the .js files in this directory define the type of the class in terms of react prototypes.
- app/models
	each sub directory corresponds to a collection in the database. These directories can have
		-index.js which defines a class that extends mungo and includes the schema. If the directory name is political-party the class name should be PoliticalParty
		-hook.js
		-migration.js
		-schema.js
		-migrations (directory)
		-hooks (dirctory)
		-methods (directory)
		-statics (directory)
			-lambda.js is used in testing
- fixtures
	each sub directory is named for the db collection and contains a 1.json file with initialization data for that collection.


# DB File and name Structure

Explaining the stucture using 'politcal party' as the name to show how naming and capitalization go:

windows.socket.emit('get political parties',ok); to request the fixture data from the collection

app/api/get-political-parties.js : getPoliticalParties function to gets the data from the collection
app/lib/proptypes/political-party.js defines a React ProtoType for politicalParty

when using politicalParties as a type in a class of a larger structure, use:
- import politicalPartyType             from '../lib/proptypes/political-party' 
to get the prototype, and then 
- politicalParties : React.PropTypes.arrayOf(politicalPartyType)  
to define the variable in the class you are using it in

app\models\political-party\index.js defines the class PoliticalParty which extends Mungo.Model and includes
- the 'collection' name in the db 'political_parties'
- the 'schema' object of the collection
- the version of the schema (used for migration)
- the list of migrations which are .js files in ./migrations like 1.js and then 2.js
	- these migrations will be applied at build time to convert previous schemas of the collection into the new schema

app/models/political-party/schema.js defines the schema if this was made up up other objects 
	- if another schema imports this one, it's PoliticalParty from ../political-party and the object name is party (but should it have been political_party???)

app\models\political-party\migrations\1.js
defines 
	- class PoliticalParty extends Mungo.Migration {
	  	- static version 
	  	- static collection = 'political_parties';
		- static schema = { name : String };
		- static do ()

app\models\political-part\migrations\2.js
	- has code that will create a fixture (the default values for the input field) this would probably be 1.js for a new data set
	references syn/../../fixtures/political-party/1.json to find the object defining the default values  ?? why syn and where is that defined

 

## Using User Interface Manager







