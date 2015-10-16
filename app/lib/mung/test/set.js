'use strict';

import should from 'should';
import Mung from '../';

class Foo extends Mung.Model {
  static schema () {
    return {
      date : Date
    };
  }
}

describe ( 'Setters' , function () {

  describe ( 'Set date' , function () {

    const doc = new Foo();

    it ( 'should set date to now' , function () {

      doc.set('date', Date.now());

      console.log(doc.date)

    });

  });

});
