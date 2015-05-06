! function () {
  
  'use strict';

  var User      =   require('syn/models/User');
  var User      =   require('syn/models/User');
  var mongoUp   =   require('syn/lib/util/connect-to-mongoose');
  var isA       =   require('syn/lib/util/should/add');

  var mongo;
  var user;

  describe ( 'Models / User / Statics / Disposable' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      isA ( 'User' , require('../.User'));

      mongo = mongoUp();

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a static method' , function () {

      User.schema.statics.should.have.property('disposable')
        .which.is.a.Function;

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should create user' , function (done) {

      User
        
        .disposable().then(function (disposableUser) {

          user = disposableUser;

          user.should.be.an.User;

          done();
        });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'user should exist' , function (done) {

      User
        
        .findById(user._id)

        .exec()

        .then(function (_user) {
          _user._id.toString().should.be.exactly(user._id.toString());
          done();
        }, done);

    });

    ///////////////////////////////////////////////////////////////////////////

    after ( function (done) {

      user.remove(function () {
        mongo.disconnect(done);
      });

    } );

  } ); 

} ();
