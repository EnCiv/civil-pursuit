'use strict';

require('babel-polyfill');


class Foo {

}

class Bar extends Foo {

}

console.log(Reflect.getPrototypeOf(Bar));
