'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import Type           from '../../models/type';

function isType (type, compare = {}, serialized = false) {
  const suite = [];

  const shouldHaveAName = {
    'should have a name' : (ok, ko) => {
      type.should.have.property('name').which.is.a.String();
      ok();
    }
  };

  const rightId = {
    'should have the right _id' : (ok, ko) => {
      type._id.toString().should.be.exactly(compare._id.toString());
      ok();
    }
  };

  const rightName = {
    'should have the right name' : (ok, ko) => {
      type.name.should.be.exactly(compare.name);
      ok();
    }
  };

  if ( serialized ) {
    suite.push(
      {
        'should be serialized' : (ok, ko) => ok()
      }
      ,
      {
        'should be an object' : (ok, ko) => {
          type.should.be.an.Object();
          ok();
        }
      },
      {
        'should have an _id' : (ok, ko) => {
          type.should.have.property('_id').which.is.a.String();
          Mungo.ObjectID(type._id).should.be.an.instanceof(Mungo.ObjectID);
          ok();
        }
      },
      shouldHaveAName
    );

    if ( '_id' in compare ) {
      suite.push(rightId);
    }

    if ( 'name' in compare ) {
      suite.push(rightName);
    }
  }
  else {
    suite.push(
      {
        'should not be serialized' : (ok, ko) => ok()
      },
      {
        'should be a Type' : (ok, ko) => {
          type.should.be.an.instanceof(Type);
          ok();
        }
      },
      {
        'should have an _id' : (ok, ko) => {
          type.should.have.property('_id').which.is.an.instanceof(Mungo.ObjectID);
          ok();
        }
      },
      shouldHaveAName
    );

    if ( '_id' in compare ) {
      suite.push(rightId);
    }

    if ( 'name' in compare ) {
      suite.push(rightName);
    }
  }

  return suite;
}

export default isType;
