'use strict';

class Foo extends Promise {
  constructor (fn) {
    super(fn);
  }
}

new Foo((ok, ko) => ok()).then(() => console.log('hola'));
