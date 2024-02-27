# Civil Pursuit Web Application

This is a tool to enable large scale deliberation online. It leads people through a discussion process, not chat, that engages them in finding what they agree on. The process stages are derived from in-person dialog and deliberation but here they can be automated and made to scale to support very large numbers of participants.

[<img width="638" alt="image" src="https://user-images.githubusercontent.com/3317487/233766186-d63eb3d3-4015-4551-bb00-7ff4403c64b5.png">](https://civilpursuit.herokuapp.com/item/pvote)
[Click here to try it](https://civilpursuit.herokuapp.com/item/pvote)

## License

This work is licensed under the terms described in [LICENSE.txt](https://github.com/EnCiv/civil-pursuit/blob/master/LICENSE.txt) which is an MIT license with a Public Good License Condition.

## Getting Started

### Dev Environment for Easy Project Switching

This project uses **bash**. This follows the cloud environment. The OS manufactures have their idea about what shell to run, but that's for work in their environment.  Think of the shell as something that is project dependent. If you are on Windows and don't have bash yet, there's [gitforwindows.org](https://gitforwindows.org/). No need to change your default shell, just get it on your computer and think of it as a project by project configuration. In Visual Studio Code, open your terminnal at the top and it will allows you to select bash for this project. 

The .bashrc file in each project's directory can contain custom environment variables and aliases and such for the project. This is where we put secrets becasue the .bashrc file is ignored by .gitignore and won't be put in the repo.

These steps will make it easy to switch between multiple projects and repos, but automatically running the .bashrc file in a project when you start bash in that directory.

In your home (cd ~) directory find or create a **.bash_profile** on PC or a **.profile** on mac and add this to it. If neither exist, create both just to be sure.

```
if [`pwd` != $HOME ] && [[ -f "./.bashrc" ]]; then
    echo running `pwd`/.bashrc
    source ./.bashrc
fi
```

This works great when you open a terminal in a project directory, for example when you are using visual studio code. But do what it takes to make sure that you are running bash in your terminal.

### Getting the corresponding version of Node
We are reserecting this project from the past. At this point it needs Node version v16.20.1, but we will be moving toward a more current version as we work on this.

[Node Version Switcher](https://github.com/jasongin/nvs) is recommended to make easially switch between versions of node.
And if you have that installed, you can use this to get the right version. You could also add this to the .bashrc file in the civil-pursuit directory after it gets created.

```bash
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

**Note:** If you started out with a newer version of node, but are now rolling back, you will need to run `npm ci` the first time to clean out the node_modules director and rebuild it.

For the first stages of this project, we will be focusing on storybook

```bash
npm run storybook
```

### MongoDB

This app uses MONGODB and you will need a mongodb uri to get started. Cloud.[mongodb.com](https://www.mongodb.com/) has free accounts, you can go there and follow these [instructions](https://docs.google.com/presentation/d/10fEk_OdfN-dYh9PlqG6nTFlu4ENvis_owdHbqWYDpBI/present?slide=id.gb4a0dbf10b_0_93)

you should end up with a line like this in your .bashrc file.

The instructions above are continually getting out of sync with MongoDB's lates UI.  Revised instructions would be a welcome contribution that would make it easier for the next developer. 

```
export MONGODB_URI="mongodb+srv://user-name:secret-password@cluster0.vwxyz.mongodb.net/db-name?retryWrites=true&w=majority"
```

Note that it's confusing but user-name and db-name can be anything. You pick them when you create the database, and you use them in this URI string. That's all.

After you get Mongo setup, you also need these ENV variable in your .bashrc file

```
export NODE_ENV="development"
export SYNAPP_ENV="alpha"
```

Then you should be able to run the development server. You may also need to `source .bashrc` first.

```
npm run dev
```

It should startup. You will be able to browse to [localhost:3011/](localhost:3011/) but there won't be anything useful in the database.
So after you get this far, request via slack a link to the "civil-pursuit-template" google drive directory where there is a bunch of db records and a README file that explains how to put it into the database.

Then you can browse to [localhost:3011/item/pvote](localhost:3011/item/pvote) and see the discussion.

# Contributing
Before you begin, please review the [React Component guidelines and notes](#react-component-guidelines-and-notes) below.

If you are not already, get on the [slack workspace](https://docs.google.com/forms/d/e/1FAIpQLSee58BUiy12dtloG9pLITsELcNldIwXcEtCotV9r95BZJSIVA/viewform?usp=sf_link) by filling out this [form](https://docs.google.com/forms/d/e/1FAIpQLSee58BUiy12dtloG9pLITsELcNldIwXcEtCotV9r95BZJSIVA/viewform?usp=sf_link) and then getting the link it provides after submission to go to join slack.

To look for things to work on go to the [Issues](https://github.com/EnCiv/civil-pursuit/issues) tab above.
Look for issues that do not have anyone assigned. Also, issues toward the top may indicate that earlier issues are required first, so make sure those are closed, or look further down the list. 

When you find one that you want to work on, assign it to yourself, or if you do not have permission yet, leave a comment saying you want to take this one. 
You are also welcome to ask about issues on slack or the developers meeting. The dev meeting link and annoucments are posted in the #developers channel on slack.

Before you begin, please review the [React Component guidelines and notes](#react-component-guidelines-and-notes) below.

Before you start coding, create a new branch for this issue:
```bash
git checkout -b short-issue-text#issue-number
```
For example `point-group#35`. The issue text should just be a word or two that make it distinct, and the the issue number.
Then when you are ready to create a PR for the issue, or if you just want to push the code so we can talk about it, do:
```
git push -u origin short-issue-text#issue-number
```
This will push the code to a new branch on github. (-u means upstream) After this first time, you only need to `git push` to push updates.
After your inital push, go to [github.com/EnCiv/civil-pursuit](https://github.com/EnCiv/civil-pursuit) and there will be a banner asking you if you want to creat a PR for this branch. Go ahead.  Also, if you are only pushing this for review, there is a box you can check that says draft, or you can just day Draft in the comment title.

# React Component guidelines and notes:

<details>
    <summary>General notes on react component boilerplate stuff. Also, we want to state the 'why' for each guideline.</summary>

These notes are pretty general and always open to reevaluation.

**my-component.js**

```js
// https://github.com/EnCiv/civil-pursuit/issue/NUMBER
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export default function MyComponent(props) {
  const { className, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  // otherProps is gathered from props and expanded into to the outer tag so that
  // the parent of this component can pass in things like style or onHover or whatever
  // allowing this component to be as extensible as possible without recoding
  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      Hello World
    </div>
  )
}

// we want to see the code first, so we put the classes at the bottom
const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    background: theme.colorPrimary,
    padding: '1rem',
  },
}))
```

1. This project is using React-jss for styles, and they should be at the bottom of the file. -- It's efficient to have all the code and style for a component in one place. We've learned over time that we want to see the code first, and then look for the css, so we put the styles at the bottom. We have also started using a theme so that absolute values like colors can be given names and shared across components.

2. The theme is in [**app/theme.js**](https://github.com/EnCiv/civil-pursuit/blob/master/app/theme.js). We should look through there, and add to it as we go, and talk through the best ways to make properties that are common to many components. To see examples of how to use the theme and what colors, sizes and other styling information are currently part of the theme, we can also check out the 'Theme Examples' Storybook stories and its code at [**stories/theme.stories.js**](https://github.com/EnCiv/undebate-ssp/blob/main/stories/theme.stories.js).

3. As in the above example, generally components should accept all props, extract out the ones that are specific to the component, and expand all the other props into the outer tag of what's being rendered. For props that are used by this component, like className (or style), but would also be passed down from a parent, this component should combine it's values with the values being passed down - as in using cx(className, classes.wrapper).

4. To make components responsive, do not use 'px'. We need to convert this to 'rem', 'em', 'vw', or 'vh' as appropriate to make the components responsive. Figma now has a developers mode where you can get the output in rem rather than pixels. See [Figma now supports REM](https://uxdesign.cc/figma-now-supports-rem-units-understanding-the-use-and-benefits-5957fc1ecb78)

5. Most components should take their width from the parent - not set the width. They should have no margin (whitespace around the component), and expect their their parent will apply padding as necessary. - This makes it easier for parent component to line up their children. If different child components have different built in white space, it's hard for the parent to line them up.

6. File names should be all lowercase, use '-' between words, and end in .js (.jsx should be reserved for react class based components). Some OS's are case sensitive others are not.

7. We are using storybook to build stories for each component. This makes it quicker and easier to build and iterate the component. Then, after it's done we have a great test cases and a great visual library of all the components. Within the stories/my-component.stories.js file for a component, create multiple stories that exercise the functionality of the component. - Future contributors are going to come back to the story to see how the component works - or to test it for some new situation. See the stories director for examples.

8. Include a link to the github issue as a comment at the top of the component file and the top of the story to make it easier to go back and reference it. Also, we should add comments to the issues as we make design decisions that change the original direction in the issue. - We end up putting a lot of good info, and pictures, into the issue and its useful to have it handy even after the issue is closed.

9. Components that accept input, or action from the user should accept an `onDone` parameter, which is a function to call with `{valid: bool, value: any}`. Whenever the user leaves the component, typically through onBlur the component should call onDone, and with value set to the value of this input (which could be an object), and valid set to whether or not the value is valid. Empty should - generally - be considered not valid. Higher level components will figure out how the UI reacts to the valid/value returned. This allows more complete logic than just 'required'.

In storybook tests, onDone can be tested with a common function.

**stories/my-text-input-component.stories.js:**

```JS
// https://github.com/EnCiv/civil-pursuit/issue/NUMBER
import { onDoneDecorator, onDoneResult } from './common'
import MyTextInputComponent from '../app/components/my-text-input-component'

export default {
  component: MyTextInputComponent,
  args: {},
  decorators: [onDoneDecorator], // inserts the onDone argument, and adds html to the bottom showing the onDone result
}

export const onDoneTest = {
  args: { },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textEle = canvas.getByPlaceholderText(/type some thing here/i)
    await userEvent.type(textEle, 'This is text')
    await userEvent.tab() // moving out of the input field causes onDone to be called
    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: { valid: false, value: { subject: 'This is text' } },
    })
  },
}
```

 </details>

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

When copying the svg code out of figma, it is important to drill all the way down until you just get the figure and now padding around it.

There is a Show Icons story in Storybook, that shows all the icons in the project.  
![image](https://github.com/EnCiv/civil-pursuit/assets/3317487/362baacb-23ec-4d77-a43b-288e434d1394)

The green border shows the outline around the figure. Make sure the green box touches the figure on all four sides - or it will be hard to place and scale the component in different uses.

Occasionally, I have had to edited the file in assets/svg to tweak the viewBox dimensions to get it exactly right. After you do, you will have to re-run `npm run svgr` to update the component. (but you can do it from another terminal window and leave storybook running)

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
