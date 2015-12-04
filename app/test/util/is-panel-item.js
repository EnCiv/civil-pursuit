'use strict';

import Mungo                    from 'mungo';
import { Popularity }           from '../../models/item/methods/get-popularity';

function test (panelItem, item = {}, serialized = false) {
  const suite = [];

  const object = {
    'panel item should be an object' : (ok, ko) => {
      try {
        panelItem.should.be.an.Object();
        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const id = {
    'should have id which is a string' : (ok, ko) => {
      try {
        panelItem.should.have.property('id').which.is.a.String();

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const idMatch = {
    'should have the same id than item' : (ok, ko) => {
      try {
        panelItem.id.should.be.exactly(item.id);

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const subject = {
    'should have subject which is a string' : (ok, ko) => {
      try {
        panelItem.should.have.property('subject').which.is.a.String();

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const subjectMatch = {
    'should have the same subject than item' : (ok, ko) => {
      try {
        panelItem.subject.should.be.exactly(item.subject);

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const description = {
    'should have description which is a string' : (ok, ko) => {
      try {
        panelItem.should.have.property('description').which.is.a.String();

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const descriptionMatch = {
    'should have the same description than item' : (ok, ko) => {
      try {
        panelItem.description.should.be.exactly(item.description);

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const image = {
    'may have an image which is a string' : (ok, ko) => {
      try {
        if ( 'image' in panelItem ) {
          panelItem.should.have.property('image').which.is.a.String();
        }

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const imageMatch = {
    'should have the same image than item' : (ok, ko) => {
      try {
        panelItem.image.should.be.exactly(item.image);

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const references = {
    'may have references' : (ok, ko) => {
      if ( 'references' in panelItem ) {
        panelItem.should.have.property('references').which.is.an.Array();

        if ( panelItem.references.length ) {
          panelItem.references[0].should.be.an.Object()
            .and.have.property('url').which.is.a.String()
            .and.startWith('http');

          if ( 'title' in panelItem.references[0] ) {
            panelItem.references[0].title.should.be.a.String();
          }
        }
      }

      ok();
    }
  };

  const referencesMatch = {
    'should have the same references than item' : (ok, ko) => {
      try {
        panelItem.should.have.property('references')
          .which.is.an.Array()
          .and.have.length(item.references.length);

        if ( item.references.length ) {
          item.references.forEach((reference, index) => {
            panelItem.references[index].should.be.an.Object();

            for ( let field in reference ) {
              panelItem.references[index].should.have.property(field)
                .which.is.exactly(reference[field]);
            }
          });
        }

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const promotions = {
    'should have promotions which is a number' : (ok, ko) => {
      try {
        panelItem.should.have.property('promotions').which.is.a.Number();

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const promotionsMatch = {
    'should have the same promotions than item' : (ok, ko) => {
      try {
        panelItem.promotions.should.be.exactly(item.promotions);

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const views = {
    'should have views which is a number' : (ok, ko) => {
      try {
        panelItem.should.have.property('views').which.is.a.Number();

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const viewsMatch = {
    'should have the same views than item' : (ok, ko) => {
      try {
        panelItem.views.should.be.exactly(item.views);

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    }
  };

  const comparation = [];

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if ( serialized ) {
    suite.push(
      {
        'should be serialized' : (ok, ko) => ok()
      },
      object,
      id,
      subject,
      description,
      image,
      references,
      promotions,
      views,
      {
        'should have popularity' : (ok, ko) => {
          panelItem.should.have.property('popularity')
            .which.is.an.Object();

          ok();
        }
      }
    );
  }
  else {
    suite.push(
      {
        'should not be serialized' : (ok, ko) => ok()
      },
      object,
      id,
      subject,
      description,
      image,
      references,
      promotions,
      views,
      {
        'should have popularity' : (ok, ko) => {
          panelItem.should.have.property('popularity')
            .which.is.an.instanceof(Popularity);

          ok();
        }
      }
    );
  }

  if ( Object.keys(item).length ) {

    suite.push({
      'should match compare' : comparation
    });

    if ( 'id' in item ) {
      comparation.push(idMatch);
    }

    if ( 'subject' in item ) {
      comparation.push(subjectMatch);
    }

    if ( 'description' in item ) {
      comparation.push(descriptionMatch);
    }

    if ( 'image' in item ) {
      comparation.push(imageMatch);
    }

    if ( 'references' in item && item.references.length ) {
      comparation.push(referencesMatch);
    }

    if ( 'promotions' in item ) {
      comparation.push(promotionsMatch);
    }

    if ( 'views' in item ) {
      comparation.push(viewsMatch);
    }
  }

  return suite;
}

export default test;
