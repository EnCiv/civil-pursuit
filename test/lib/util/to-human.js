! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function TestModule_Lib__ToHuman (done) {

    var humanized = 'Hey i am an example';

    var camel = 'HeyI_AmAnExample';

    var snake = 'Hey_I_Am_An_Example';

    var slug = 'hey-i-am-an-example';

    di(done, deps, function (domain, Test) {

      var toHuman;

      function Module_Lib__toHuman_Exists (done) {
        toHuman = require('syn/lib/util/to-human');
        done();
      }

      function Module_Lib__toHuman_IsA_Function (done) {
        toHuman.should.be.a.Function;
        done();
      }

      function Module_Lib__toHuman_HumanizesCamelCase (done) {
        toHuman(camel).should.be.exactly(humanized);
        done();
      }

      function Module_Lib__toHuman_HumanizesSnakeCase (done) {
        toHuman(snake).should.be.exactly(humanized);
        done();
      }

      function Module_Lib__toHuman_HumanizesSlug (done) {
        toHuman(slug).should.be.exactly(humanized);
        done();
      }

      Test([
          Module_Lib__toHuman_Exists,
          Module_Lib__toHuman_IsA_Function,
          Module_Lib__toHuman_HumanizesCamelCase,
          Module_Lib__toHuman_HumanizesSnakeCase,
          Module_Lib__toHuman_HumanizesSlug
        ],
        done);

    });

  }

   module.exports = TestModule_Lib__ToHuman;

} ();
