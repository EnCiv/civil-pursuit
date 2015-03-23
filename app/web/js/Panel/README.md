Panel Component
===============

The Panel Component is a UI module that displays a panel widget and can talk to back-end.

# API

A panel is identified by its type and the parent item if any. Together, these attributes form the DOM ID to connect the Model with the View. Panel have fine-grain methods to retrieve and display items.

## Constructor

```js
new Panel(String type, ObjectID? parent);
```

- Where `type` is a the panel's type, ie `Topic`, `Problem`, `Solution`, etc.
- Where `parent` is an optional ObjectID enforcing an item parent.

```js
var topicsPanel = new Panel('Topic');
```

## `id`

An `id` property is generated that can then track the UI panel using its DOM id.

```js
console.log(topicsPanel.id);
```

## Load template

Panel is a UI module which template needs to be loaded from the back-end. Results are cached after first fetch and then cache is used. The template is handled out by `load` but it is not inserted in the DOM. **You need to append the template yourself**. Also the template is **unrendered**. You need to invoke the `render()` method for that.

```js
Panel.load(Function cb);
```

```js
topicsPanel.load(app.domain.intercept(function (template) {
    topicsPanel.template === template;

    // Inject in DOM

    $('body').append(template);
}));
```

Template is cached under `app.cache.template.panel` global variable.

## Template node finder

The `find()` method is an convenient access method to the template's DOM.

## Render

Invoke the `render()` method to inject panel into the DOM.

```js
Panel.render(Function cb);
```

```js
// In this workflow we do:
//  - load template
//  - render template
//  - inject template in DOM

topicsPanel.load(app.domain.intercept(function (template) {
    topicsPanel.render(app.domain.intercept(function () {
        $('body').append(topicsPanel.template);
    }));
}));
```

## Fill

After rendering your panel, you can fill it with items. **Items are not filled automatically**. You need to explicitly call `fill()`.

```js
Panel.fill(Function cb);
```

```js
topicsPanel.fill(app.domain.intercept(function (items) {
    console.log('Panel got items', items);
}));
```

Fill is:

- Getting items from Web Sockets
- Handing items over to Item()
- Pass new items to pre-rendering

## Pre-rendering items

`fill()` is fetching the items to fill the panel with. `fill()` retrieves an array of items `[Item]`. This array is then handed out to pre-rendering when unrendered items' templates are inserted into DOM.

```js
topicsPanel.fill(app.domain.intercept(function (items) {
    topicsPanel.preRenderItems(items, app.domain.intercept(function (items) {
        items === [Item];
    }));
}));
```

## Rendering items

Final rendering of items is done via `renderItems()`.

```js
topicsPanel.renderItems(app.domain.intercept());
```

## Pagination

Panel keeps an internal count of the pages in the properties `skip` and `size`. `skip` is a `Number` representing the start offset. `size` is a `Number` representing batch size of items.








