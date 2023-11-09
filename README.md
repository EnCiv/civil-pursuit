# Civil Pursuit Web Application

This is a tool to enable large scale deliberation online. It leads people through a discussion process, not chat, that engages them in finding what they agree on. The process stages are derived from in-person dialog and deliberation but here they can be automated and made to scale to support very large numbers of participants.

[<img width="638" alt="image" src="https://user-images.githubusercontent.com/3317487/233766186-d63eb3d3-4015-4551-bb00-7ff4403c64b5.png">](https://civilpursuit.herokuapp.com/item/pvote)
[Clink here to try it](https://civilpursuit.herokuapp.com/item/pvote)

## License

This work is licensed under the terms described in [LICENSE.txt](https://github.com/EnCiv/civil-pursuit/blob/master/LICENSE.txt) which is an MIT license with a Public Good License Condition.

## Getting Started

We are reserecting this project from the past. At this point it needs Node version v16.20.1, but we will be moving toward a more current version as we work on this.

I have been using [Node Version Switcher](https://github.com/jasongin/nvs) to make easially switch between versions of node.
And if you have that installed, you can use this to get the right version. You could also add this to the .bashrc file in the civil-pursuit directory after it gets created.

```
# get the node version from package.json and use https"//github.com/jasongin/nvs to switch to it
export NODE_VERSION=$(cat package.json | grep '\"node\":' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')
nvs add $NODE_VERSION
source nvs.sh use $NODE_VERSION
```

Then, after you get the right version of node (and npm) do this

```bash
git clone https://github.com/EnCiv/civil-pursuit.git
cd civil-pursuit
npm install

```

For the first stages of this project, we will be focusing on storybook

```
npm run storybook
```

### MongoDB

This app uses MONGODB and you will need a mongodb uri to get started. Cloud.mongodb.com has free accounts, you can go there and follow these [instructions](https://docs.google.com/presentation/d/10fEk_OdfN-dYh9PlqG6nTFlu4ENvis_owdHbqWYDpBI/present?slide=id.gb4a0dbf10b_0_93)

you should end up with a line like this in your .bashrc file

```
export MONGODB_URI="mongodb+srv://user-name:secret-password@cluster0.vwxyz.mongodb.net/db-name?retryWrites=true&w=majority"
```

Note that it's confusing but user-name and db-name can be anything. You pick them when you create the database, and you use them in this URI string. That's all.

After you get Mongo setup, you also need these ENV variable in your .bashrc file

```
export NODE_ENV="development"
export SYNAPP_ENV="alpha"
export MONGODB_URI=$MONGODB_URI
```

Then you should be able to run the development server. You may also need to `source .bashrc` first.

```
npm run dev
```

It should startup. You will be able to browse to [localhost:3011/](localhost:3011/) but there won't be anything useful in the database.
So after you get this far, request a link to the "civil-pursuit-template" google drive directory where there is a bunch of db records and a README file that explains how to put it into the database.

Then you can browse to [localhost:3011/item/pvote](localhost:3011/item/pvote) and see the discussion.

### Dev Environment for Easy Project Switching

This project uses bash. This models the cloud environment. The .bashrc file in the each project's directory can contain custom environment variables and aliases and such for the project. This is where we put secrets becasue the .bashrc file is ignored by .gitignore and won't be put in the repo.

These steps will make it easy to switch between multiple projects and repos, but automatically running the .bashrc file in a project when you start bash in that directory.

In your home (cd ~) directory find or create a **.bash_profile** on PC or a **.profile** on mac and add this to it. If neither exist, create both just to be sure.

```
if [`pwd` != $HOME ] && [[ -f "./.bashrc" ]]; then
    echo running `pwd`/.bashrc
    source ./.bashrc
fi
```

This works great when you open a terminal in a project directory, for example when you are using visual studio code.

# Icons, Figma and SVG

<details>
    <summary>You can export svg from figma and paste it into a .svg file in assets/svg to create icons.</summary>

For example assets/svg/trash-can.svg

```
<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 6.58661H5H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 6.58661V4.58661C8 4.05618 8.21071 3.54747 8.58579 3.1724C8.96086 2.79732 9.46957 2.58661 10 2.58661H14C14.5304 2.58661 15.0391 2.79732 15.4142 3.1724C15.7893 3.54747 16 4.05618 16 4.58661V6.58661M19 6.58661V20.5866C19 21.117 18.7893 21.6257 18.4142 22.0008C18.0391 22.3759 17.5304 22.5866 17 22.5866H7C6.46957 22.5866 5.96086 22.3759 5.58579 22.0008C5.21071 21.6257 5 21.117 5 20.5866V6.58661H19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 11.5866V17.5866" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 11.5866V17.5866" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

This project will automatically convert the files in assets/svg into react.js files in app/svgr on install. After you add a new file you can manually trigger the conversion with:

```
npm run svgr
```

Then you can use these svg files as React components in your code like this:

```
import TrashCan from '../svgr'

function renderSomething(){
    return <SvgTrashCan />
}
```

</details>

#

# The rest of this is from the old README file and may be dated

## Environment

These ENV variables need to be set:

- CLOUDINARY_URL - to a cloudinary CDN, one can be shared by many instances
- MONGO_HQ_URL - not we don't use mongohq anymore, we are using mongolabs, but we still set that env variable
- NODE_ENV - production or development
- SYNAPP_ENV - used as index into config files like public.json

## Install

You can also install and build locally, but watch out for incompatibilities. Heroku is the gold standard.

```bash
npm install
```

## Start

```bash
npm start
```

## NPM commands

- `npm install` - Install app
- `npm start` - Start app
- `npm test` - Run all tests suites
- `npm run transpile` - Transpile ES6/7 ro ES5 (babel)
- `npm run hot-transpile` - Same than transpile, but live
- `npm run build` - Browserify
- `npm run watchify` - Browserify live (with watchify)
- `npm run watch-less` - Convert LESS to css
- `npm run reset` - Empty database then populate it running the migrations

## Directory Structure

- `app/bin/start.js` is where it starts
- `app/server.js` is the main server code
- `app/client/main.js` is the entrypoint for browser side code, but this will run on the server side too

- `app/api`
  The files in this directory are collected up by app/api.js and executed based on events from the browser. On the browser side you emit an event to
  window.socket.emit('name of api', ...parameters)
  and the file name-of-api with the exported function nameOfAPI will be executed on the server and its results returned.

- `app/components` these are the react/jsx components that make up the app
- `app/components/app.jsx` this is the fist component, called from client.js. It looks at the url path and (like the server did) and calls subcomponents from there. The browsr can move between components (eg from / to /About) without going back to the server.
- `app/components/store` data is gathers through the api calls and stored in state, for child componets to use as props. This is how DB stuff gets to the browser.

- `app/lib` this is js (not jsx) code used in the app
- `app/lib/proptypes`
  the .js files in this directory define the type of the class in terms of react proptypes.

- `app/models`
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

- `app/pages/index.js` - this file builds the index.html file that will be returned to the HTML get request.

- `app/routes` - the server side express route handlers

- `app/test` - a selenium based test fixture, and test. Basically it fires up an instance of the server, and then opens a browser to it, sending events and checking results. [But this is not being maintained right now because of how much work is required when there is a user interface change]

- `assets/less/index.less` - this is the list of less files that will be turned into css, combined and uglified into assets.min.css

- `dist` - excluded from the source tree, this is where npm builds into
- `dist/assets/css/assets.min.css` - is built at build time from assets/less/index.less
- `dist/assets/js/main.min.js` - built by bundle.sh at build time

- `fixtures`
  each sub directory is named for the db collection and contains a 1.json file with initialization data for that collection.

- `post-install.sh` - on heroku, after everyting in installed, this is run to create the dist directory and build the required files.

# DB File and name Structure

Explaining the stucture using 'politcal party' as the name to show how naming and capitalization go:

windows.socket.emit('get political parties',ok); to request the fixture data from the collection

app/api/get-political-parties.js : getPoliticalParties function to gets the data from the collection
app/lib/proptypes/political-party.js defines a React PropType for politicalParty

when using politicalParties as a type in a class of a larger structure, use:

- import politicalPartyType from '../lib/proptypes/political-party'
  to get the proptype, and then
- politicalParties : PropTypes.arrayOf(politicalPartyType)
  to define the variable in the class you are using it in

app\models\political-party\index.js defines the class PoliticalParty which extends Mungo.Model and includes

- the 'collection' name in the db 'political_party'
- the 'schema' object of the collection
- the version of the schema (used for migration)
- the list of migrations which are .js files in ./migrations like 1.js and then 2.js
  - these migrations will be applied at build time to convert previous schemas of the collection into the new schema

app/models/political-party/schema.js defines the schema if this was made up up other objects - if another schema imports this one, it's PoliticalParty from ../political-party and the object name is party (but should it have been political_party

app\models\political-party\migrations\1.js
defines - class PoliticalParty extends Mungo.Migration { - static version - static collection = 'political_party'; - static schema = { name : String }; - static do ()

app\models\political-part\migrations\2.js - has code that will create a fixture (the default values for the input field) this would probably be 1.js for a new data set
references syn/../../fixtures/political-party/1.json to find the object defining the default values
