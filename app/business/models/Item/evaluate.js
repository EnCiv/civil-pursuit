! function () {
  
  'use strict';

  var others = 5;

  var async = require('async');

  var config = require('../../config.json');

  /**
   *  @class
   *  @arg {MongooseModel} model
   *  @arg {String} itemId - Item Object ID
   *  @arg {Function} cb 
   */

  function Evaluate (model, itemId, cb) {

    var self = this;

    this.model    =   model;
    this.itemId   =   itemId;
    this.cb       =   cb;

    this.domain   =   require('domain').create();
    
    this.domain.on('error', function (error) {
      cb(error);
    });

  }

  /**
   *  @method
   *  @return null
   */

  Evaluate.prototype.go = function () {
    var self = this;

    self.domain.run(function () {
      
      self
        .model
        .findById(self.itemId)
        .populate('user')
        .exec(self.domain.intercept(function (item) {
          
          if ( ! item ) {
            throw new Error('Item not found');
          }

          self.item = item;

          switch ( self.item.type ) {
            case 'Agree':
            case 'Disagree':
            case 'Pro':
            case 'Con':

              self.makeSplit();

              break;

            default:

              self.make();
              
              break;
          }
        }));

    });
  };

  Evaluate.prototype.makeSplit = function () {
    
    var self = this;

    var right;

    switch ( self.item.type ) {
      case 'Agree':
        right = 'Disagree';
        break;
      
      case 'Disagree':
        right = 'Agree';
        break;
      
      case 'Pro':
        right = 'Con';
        break;
      
      case 'Con':
        right = 'Pro';
        break;
    }

    var parallels = {

      left: function (done) {
        self.findOthers(2, done);
      },

      right: function (done) {
        self.findOthers(3, done, right);
      },

      criterias: function (done) {
        require('../Criteria').find({ type: self.item.type}, done);
      }

    };

    async.parallel(parallels, self.domain.intercept(self.packAndGo.bind(self)));
  }

  /**
   *  @method
   *  @return null
   *  @arg {number} limit
   *  @arg {function} done
   *  @arg {string} type - default self.item.type
   */

  Evaluate.prototype.findOthers = function (limit, done, type) {
    
    var self = this;

    var query = {
      type:     type || self.item.type,
      parent:   self.item.parent
    };

    self

      .model

      .count(query, self.domain.intercept(function (number) {

        var start = Math.max(0, Math.floor((number-limit)*Math.random()));

        self
          
          .model

          .find({
            type:     type || self.item.type,
            parent:   self.item.parent
          })

          .populate('user')

          .where('_id').ne(self.item._id)

          .skip(start)

          .limit(limit)

          .sort({ views: 1, created: 1 })

          .exec(done);

      }));

  }

  /**
   *  @method
   *  @return null
   *  @args {Object} results- Parallelization results
   */

  Evaluate.prototype.packAndGo = function (results) {

    var self = this;

    if ( ! ( 'items' in results ) && ( 'left' in results ) ) {
      results.items = [];

      for ( var i = 0; i < 3; i ++ ) {
        if ( results.left[i] ) {
          results.items.push(results.left[i]);
        }

        if ( results.right[i] ) {
          results.items.push(results.right[i]);
        }
      }
    }

    if ( config['evaluation context item position'] === 'last' ) {
      results.items.push(self.item);
    }

    else {
      results.items.unshift(self.item);
    }

    self.cb(null, {
      type:         self.item.type,
      item:         self.itemId,
      items:        results.items.map(self.map, self),
      criterias:    results.criterias
    });
  }

  /**
   *  @method
   *  @arg {Object} item
   */

  Evaluate.prototype.map = function (item) {

    return item.toObject({ transform: function (doc, ret, options) {
      if ( ret.user ) {
        delete ret.user.password;
      }
    }});

  };

  /**
   *  @method
   *  @return null
   */

  Evaluate.prototype.make = function () {
    var self = this;

    var parallels = {

      items: function (done) {
        self.findOthers(others, done);
      },
      
      criterias: function (done) {
        require('../Criteria').find({ type: self.item.type}, done);
      }

    };

    async.parallel(parallels, self.domain.intercept(self.packAndGo.bind(self)));
  };

  module.exports = function (itemId, cb) {
    return new Evaluate(this, itemId, cb).go();
  };

} ();
