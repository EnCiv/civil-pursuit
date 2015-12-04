'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import Type           from '../../models/item';
import Item           from '../../models/item';
import isType         from './is-type';
import describe       from '../../lib/util/describe';

const { Describer } = describe;

function isItem (item, compare = {}, serialized = false, populated = []) {

  console.log({ item : item.toJSON() });

  const suite = [];

  const shouldHaveASubject = {
    'should have a subject' : (ok, ko) => {
      item.should.have.property('subject').which.is.a.String();
      ok();
    }
  };

  const shouldHaveAnId = {
    'should have an id' : (ok, ko) => {
      item.should.have.property('id').which.is.a.String();
      ok();
    }
  };

  const shouldHaveADescription = {
    'should have a description' : (ok, ko) => {
      item.should.have.property('description').which.is.a.String();
      ok();
    }
  };

  const right_id = {
    'should have the right _id' : (ok, ko) => {
      item._id.toString().should.be.exactly(compare._id.toString());
      ok();
    }
  };

  const rightSubject = {
    'should have the right subject' : (ok, ko) => {
      item.subject.should.be.exactly(compare.subject);
      ok();
    }
  };

  const rightId = {
    'should have the right id' : (ok, ko) => {
      item.id.should.be.exactly(compare.id);
      ok();
    }
  };

  const rightDescription = {
    'should have the right description' : (ok, ko) => {
      item.description.should.be.exactly(compare.description);
      ok();
    }
  };

  const comparation = [];

  if ( serialized ) {
    suite.push(
      {
        'should be serialized' : (ok, ko) => ok()
      }
      ,
      {
        'should be an object' : (ok, ko) => {
          item.should.be.an.Object();
          ok();
        }
      },
      {
        'should have an _id' : (ok, ko) => {
          item.should.have.property('_id').which.is.a.String();
          Mungo.ObjectID(item._id).should.be.an.instanceof(Mungo.ObjectID);
          ok();
        }
      },
      shouldHaveASubject,
      shouldHaveAnId,
      shouldHaveADescription
    );

    if ( populated.indexOf('type') > -1 ) {
      suite.push({
        'should have a type' : new Describer(() => isType(item.type, {}, true))
      });
    }
    else {
      suite.push({
        'should have a type' : (ok, ko) => {
          item.should.have.property('type').which.is.a.String();
          ok();
        }
      });
    }
  }
  else {
    suite.push(
      {
        'should not be serialized' : (ok, ko) => ok()
      },
      {
        'should be an Item' : (ok, ko) => {
          item.should.be.an.instanceof(Item);
          ok();
        }
      },
      {
        'should have an _id' : (ok, ko) => {
          item.should.have.property('_id').which.is.an.instanceof(Mungo.ObjectID);
          ok();
        }
      },
      shouldHaveASubject,
      shouldHaveAnId,
      shouldHaveADescription
    );

    if ( populated.indexOf('type') > -1 ) {
      suite.push({
        'should have a type' : new Describer(() => isType(item.type))
      });
    }
    else {
      suite.push({
        'should have a type' : (ok, ko) => {
          item.should.have.property('type').which.is.an.instanceof(Mungo.ObjectID);
          ok();
        }
      });
    }
  }

  if ( Object.keys(compare).length ) {
    suite.push({
      'should match compare' : comparation
    });

    if ( '_id' in compare ) {
      comparation.push(right_id);
    }

    if ( 'subject' in compare ) {
      comparation.push(rightSubject);
    }

    if ( 'id' in compare ) {
      comparation.push(rightId);
    }

    if ( 'description' in compare ) {
      comparation.push(rightDescription);
    }
  }

  return suite;
}

export default isItem;
