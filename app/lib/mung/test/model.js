'use strict';

import Mung from '../';

class Bar extends Mung.Model {}

class Barz extends Mung.Model {}

class Foo extends Mung.Model {

  static schema () {
    return {

      // Function

      string                :     String,
      number                :     Number,
      boolean               :     Boolean,
      object                :     Object,
      date                  :     Date,
      regex                 :     RegExp,
      error                 :     Error,
      bar                   :     Bar,
      barz                  :     Barz,
      mixed                 :     Mung.Mixed,
      objectid              :     Mung.ObjectID,
      hex                   :     Mung.Hex,
      octal                 :     Mung.Octal,
      binary                :     Mung.Binary,
      location              :     Mung.Location,
      // Functions

      strings               :     [String],
      bars                  :     [Bar],

      // Subdocument

      subdocument           :     Mung.embed({
        string              :     String,
        bar                 :     Bar
      }),

      // Subdocuments

      subdocuments          :     [{
        string              :     String,
        bar                 :     Bar,
        bars                :     [Bar]
      }],

      // embedded subdocuments

      embeddedSubdocuments  :     Mung.embed({
        subdocument         :     Mung.embed({
          string            :     String,
          bar               :     Bar,
          bars              :     [Bar]
        })
      })

    };
  }

}

Foo.version = 1;

export { Foo, Bar };
