N   A   V
=========

`Nav` is a static class whose role is to take care of the animations of the App dedicated to enhance user's navigation experience.

# Abstract

## Human

This class contains a set of utilities used to create the navigation experience. Such utilities include:

- Defining a **point of attention** to the UI
- Showing and hiding parts of the UI

## Dev

`Nav` is a static class.

# Usage

```js
var Nav = require('./Nav');
```

# Animations

## Scroll to point of attention

### Human

A point of attention focuses user's attention to a specific part of the UI in order to call her to interact with it. Such effect is achieved by auto-scrolling the page until the point of attention is located below the Top Bar.

### Known bugs

Some vendor limitations apply. If there is no sufficent space below the point of attention, the browsers have no traction to scroll the page. Hence no scrolling can be done.

```js
Nav.scroll(jQueryList pointOfAttention, Function cb, Number speed);
```
