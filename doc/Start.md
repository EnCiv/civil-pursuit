syn / start
===

All info related to starting the app.

# Usage

```bash
npm start
```

This is calling behind the curtains:

```bash
node dist/server/start.js
```

# Process title

We named our process. If app is run in production, it will be called `synappprod`, otherwise it is called `synappdev`. This is for Unix purposes so you can find easily which process is linked to our app. For example, to kill process:

```bash
pkill synappdev
```

# Verifying environment variables

Some environment variables must be set in order to run the app.

- **MONGOHQ_URL** The mongodb url
- **SYNAPP_ENV** An extra-name, more descriptive than Production/Development. Used for examples to store different credentials for the Facebook / Twitter app.

# Init sequence

1. The app connects to the DB
1. We fetch from DB the type whose name is "Intro"
1. We fetch from DB the item whose type is the type we just fetched
1. We panelify the item
1. We start the server with the intro item as props

# Logging and Error

We log messages to console. We log messages from the server.

On error, we print the trace and we exit with a status code of 8. Since we listen to server's error, we would exit too on a server error.
