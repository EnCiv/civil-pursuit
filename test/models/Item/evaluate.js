! function () {
  
  'use strict';

  

  var Test    =   require('syn/lib/Test');

  var Item    =   require('syn/models/Item');

  var should  =   require('should');

  should.Assertion.add('evaluation', require('syn/models/test/Item/assert.evaluation'), true);

  function testEvaluation (item, done) {

    var evaluation;

    Test.suite('Item.evaluate()', {

      'should get an evaluation': function (done) {
        Item.evaluate(item._id, function (error, result) {

          if ( error ) {
            return done(error);
          }

          evaluation = result;

          done();
        });
      },

      'evaluation should be an evaluation': function (done) {
        evaluation.should.be.an.evaluation;
        done();
      },

      'evaluation type should be the same than item type': function (done) {
        evaluation.type.should.eql(item.type);
        done();
      },

      'evaluation item should be the same item': function (done) {
        evaluation.item.toString().should.eql(item._id.toString());
        done();
      },

      'if evaluation is empty, verify it is not an error': function (done) {
        if ( ! evaluation.items.length ) {
          throw new Error('if evaluation is empty, verify it is not an error');
        }
        done();
      }

    }, done);
  }

  module.exports = function (done) {

    var item;

    if ( process.env.SYNAPP_TEST_EVALUATE_ITEM ) {
      return Item
        .findById(process.env.SYNAPP_TEST_EVALUATE_ITEM, done)
        .exec(function (error, item) {
          if ( error ) {
            return done(error);
          }
          testEvaluation(item, done);
        });
    }

    Item.findOneRandom({ type: { $in: ['Topic', 'Problem', 'Agree', 'Disagree', 'Solution', 'Pro', 'Con'] } }, function (error, item) {
      if ( error ) {
        return done(error);
      }
      testEvaluation(item, done);
    });
  };

} ();
