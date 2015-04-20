! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function test__lib__util__toHuman (done) {

    var humanized = 'Hey i am an example';

    var camel = 'HeyI_AmAnExample';

    var snake = 'Hey_I_Am_An_Example';

    var slug = 'hey-i-am-an-example';

    di(done, deps, function (domain, Test) {

      var toHuman;

      function test__lib__util__toHuman___Exists (done) {
        toHuman = require('syn/lib/util/to-human');
        done();
      }

      function test__lib__util__toHuman___IsA_Function (done) {
        toHuman.should.be.a.Function;
        done();
      }

      function test__lib__util__toHuman___HumanizesCamelCase (done) {
        toHuman(camel).should.be.exactly(humanized);
        done();
      }

      function test__lib__util__toHuman___HumanizesSnakeCase (done) {
        toHuman(snake).should.be.exactly(humanized);
        done();
      }

      function test__lib__util__toHuman___HumanizesSlug (done) {
        toHuman(slug).should.be.exactly(humanized);
        done();
      }

      Test([
          test__lib__util__toHuman___Exists,
          test__lib__util__toHuman___IsA_Function,
          test__lib__util__toHuman___HumanizesCamelCase,
          test__lib__util__toHuman___HumanizesSnakeCase,
          test__lib__util__toHuman___HumanizesSlug
        ],
        done);

    });

  }

   module.exports = test__lib__util__toHuman;

} ();
