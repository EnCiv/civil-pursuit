Item Component
==============

The Item Component is a UI module that displays items.

# API

## Constructor

```js
new Item(Document? item);
```

- Where `document` is document from MongoDB's items collection.

```js
var item = new Item({...});
```

## Load template

Item is a UI module which template needs to be loaded from the back-end. Results are cached after first fetch and then cache is used. The template is handled out by `load` but it is not inserted in the DOM. **You need to append the template yourself**. Also the template is **unrendered**. You need to invoke the `render()` method for that.

```js
item.load(Function cb);
```

```js
item.load(app.domain.intercept(function ($template) {
    item.template === $template;

    // Inject in DOM

    $('panel-...').append($template);
}));
```

Template is cached under `app.cache.template.item` global variable.

## Template node finder

The `find()` method is an convenient access method to the template's DOM.

## Render

Invoke the `render()` method to inject item into the DOM.

```js
Item.render(Function cb);
```

```js
// In this workflow we do:
//  - load template
//  - render template
//  - inject template in DOM

item.load(app.domain.intercept(function () {
    item.render(app.domain.intercept(function () {
        $('panel-...').append(item.template);
    }));
}));
```








