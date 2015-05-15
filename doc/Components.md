C O M P O N E N T S
===

Components are UI modules. They consist in a View and a Controller. Both are written in JavaScript.

# View

Views are written using the [html5 library](doc/lib/html5.md)

# Controller

Controllers are JavaScript objects. Since controllers are modular, hence flexible, they don't follow a rigid interface - yet they tend to look like this:

- **a template property** a jQuery representation of the component's template
- **a find() method** a hash table of useful jQuery selectors
- **a load() method** this will fetch component's HTML template either from browser cache or http request
- **a render() method** Bindings and DOM manipulations
- **extending EventEmitter** Controllers usually extend EventEmitter in order to emit

**Note** Controllers may change in order to look more like React components, in order to react to different flows and states.

# Example

Let's create the Foo component:

```js
// components/Foo/View.js
module.exports = function (props) {
    return html5.Element('.foo').add(
        html5.Element('h1').text(props.name))
};

// components/Foo/Controller.js
// (es6 syntax for clarity)
module.exports = class FooController extends EventEmitter {
    constructor(props) {
        super()

        this.props = props
    }

    // Get template (either from cache or from HTTP)

    load () {
        return new Promise((fulfill, reject) => {
            if ( cache.Foo )
                this.template = cache.Foo

            else
                this.template = http.get('/views/Foo')
        })
    }

    // An indexed table of useful jQuery elements

    find *(name) {
        if ( name === 'Header' )
            return this.template.find('h1')

        yield name
    }

    render () {
        this.find('Header').text(this.props.name)
    }
}

// Another component's controller calling foo
// components/Bar/Controller

var Foo = require('components/Foo/Controller');

var foo = new Foo({ name: 'Rachid' })

foo.load.then(() => {
    foo.render.then(() => {
        $('body').append(foo.template)
    })
})

// Calling the View from another file to render it in HTML

var Foo = require('components/Foo/View')

var htmlString = Foo({ 'name': 'Jessica' }).toHTML()

```

