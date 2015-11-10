'use strict';

import should         from 'should';
import User           from '../../models/user';
import Mungo          from 'mungo';

should.Assertion.add('user', function (candidate) {
  this.params = { operator: 'to be a User', expected: User };

  this.obj.should.be.an.Object();

  this.obj.should.be.an.instanceof(User);

  this.obj.should.have.property('_id')
    .which.is.an.instanceof(Mungo.ObjectID);

  this.obj.should.have.property('email').which.is.a.String();

  if ( 'email' in candidate ) {
    this.obj.email.should.be.exactly(candidate.email);
  }

  this.obj.should.have.property('password').which.is.a.String();

  if ( 'password' in candidate ) {
    this.obj.password.should.not.be.exactly(candidate.password);
  }

  if ( 'image' in this.obj ) {
    this.obj.image.should.be.a.String();
  }

  if ( 'image' in candidate ) {
    this.obj.should.have.property('image').which.is.exactly(candidate.image);
  }

  if ( 'preferences' in this.obj ) {
    this.obj.preferences.should.be.an.Array();

    this.obj.preferences.forEach(preference => {
      preference.should.have.property('name').which.is.a.String();
      preference.should.have.property('value');
    });
  }

  if ( 'preferences' in candidate ) {
    this.obj.should.have.property('preferences').which.is.exactly(candidate.prepreferences);
  }

  if ( 'twitter' in this.obj ) {
    this.obj.twitter.should.be.a.String();
  }

  if ( 'twitter' in candidate ) {
    this.obj.should.have.property('twitter').which.is.exactly(candidate.twitter);
  }

  if ( 'facebook' in this.obj ) {
    this.obj.facebook.should.be.a.String();
  }

  if ( 'facebook' in candidate ) {
    this.obj.should.have.property('facebook').which.is.exactly(candidate.facebook);
  }

  if ( 'first_name' in this.obj ) {
    this.obj.first_name.should.be.a.String();
  }

  if ( 'first_name' in candidate ) {
    this.obj.should.have.property('first_name').which.is.exactly(candidate.firsfirst_name);
  }

  if ( 'middle_name' in this.obj ) {
    this.obj.middle_name.should.be.a.String();
  }

  if ( 'middle_name' in candidate ) {
    this.obj.should.have.property('middle_name').which.is.exactly(candidate.midmiddle_name);
  }

  if ( 'last_name' in this.obj ) {
    this.obj.last_name.should.be.a.String();
  }

  if ( 'last_name' in candidate ) {
    this.obj.should.have.property('last_name').which.is.exactly(candidate.last_name);
  }

  if ( 'activation_key' in this.obj ) {
    this.obj.activation_key.should.be.a.String();
  }

  if ( 'activation_key' in candidate ) {
    this.obj.should.have.property('activation_key').which.is.exactly(candidate.activation_key);
  }

  if ( 'activation_token' in this.obj ) {
    this.obj.activation_token.should.be.a.String();
  }

  if ( 'activation_token' in candidate ) {
    this.obj.should.have.property('activation_token').which.is.exactly(candidate.activation_token);
  }

  if ( 'race' in this.obj ) {
    this.obj.race.should.be.an.Array();

    this.obj.race.forEach(race => race.should.be.an.instanceof(Mungo.ObjectID));
  }

  if ( 'race' in candidate ) {
    this.obj.should.have.property('race').which.is.exactly(candidate.race);
  }
});
