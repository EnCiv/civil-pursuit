const POST_ITEM_URI = '/json/Item';

var request   =   require('supertest');
var mocha     =   require('mocha');
var assert    =   require('assert');
var server    =   require('../lib/express');
var app       =   server(null, true);
var should    =   require('should');

var problemv, agreev, disagreev, solutionv, prov, conv;

var test_data = {
  create_topic: {
    type:         'Topic',
    subject:      'I am a test topic created on ' + new Date().toString(),
    description:  'Some random description here'
  }
};

function test_createTopic () {
  describe('POST Topic when not signed in', function () {
    it('should respond with Unauthorized', function (done) {
      request(app.server)
        .post(POST_ITEM_URI)
        .send(test_data.create_topic)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (error, response) {
          if ( error ) {
            throw error;
          }
          should(response).be.an.Object;
          should(response).have.property('body');
          should(response.body).be.an.Object;
          should(response.body).have.property('error');
          should(response.body.error).be.an.Object;
          should(response.body.error).have.property('name');
          should(response.body.error.name).be.a.String;
          should(response.body.error.name).equal('Synapp_UnauthorizedError');
          should(response.body.error).have.property('message');
          should(response.body.error.message).be.a.String;
          should(response.body.error.message).equal('You must be signed in');
          should(response.body.error).have.property('stack');
          should(response.body.error.stack).be.an.Object;
          should(response.body.error).have.property('statusCode');
          should(response.body.error.statusCode).be.a.Number;
          should(response.body.error.statusCode).equal(401);
          should(Object.keys(response.body.error)).eql(['name', 'message', 'stack', 'statusCode']);
          done();
        });
    });
  });
}

test_createTopic();

// Get topics (navigator)

// describe('GET topics', function () {
//   it('respond with json an array of topics', function (done) {
//     request(app[1])
//       .get('/json/Item/?type=Topic&limit::5&sort::promotions-')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end(function (error, res) {
//         if ( error ) {
//           throw error;
//         }

//         should(res).be.an.Object;
//         res.should.have.property('body');
//         res.body.should.be.an.Array;
//         should(res.body.length > 0).be.true;

//         res.body.forEach(function (topic) {
//           testItem(topic, 'Topic');
//         });

//         testProblem(res.body[0]._id);

//         done();
//       });
//   })
// });

function testItem (item, type) {
  item.should.be.an.Object;
          
  item.should.have.property('_id');
  item._id.should.be.a.String;
  item._id.should.have.lengthOf(24);
  
  item.should.have.property('description');
  item.description.should.be.a.String;

  item.should.have.property('image');
  item.image.should.be.a.String;

  item.should.have.property('subject');
  item.subject.should.be.a.String;

  item.should.have.property('type');
  item.type.should.be.a.String;
  item.type.should.equal(type);

  item.should.have.property('user');
  item.user.should.be.a.String;
  item.user.should.have.lengthOf(24);

  item.should.have.property('promotions');
  item.promotions.should.be.a.Number;

  item.should.have.property('views');
  item.views.should.be.a.Number;

  item.should.have.property('created');
  item.created.should.be.a.String;
  new Date(item.created).should.not.equal('Invalid date');

  item.should.have.property('edited');
  item.edited.should.be.a.String;
  new Date(item.edited).should.not.equal('Invalid date');

  item.should.have.property('references');
  item.references.should.be.an.Array;

  item.references.forEach(function (ref) {
    ref.should.be.an.Object;
    ref.should.have.property('url');
    ref.url.should.be.a.String;

    if ( ref.title ) {
      ref.title.should.be.a.String;
    }
  });
}

function testProblem (topic) {
  describe('GET problems of topic ' + topic, function () {
    it('response with json an array of problems', function (done) {
      request(app[1])
        .get('/json/Item/?type=Problem&parent=' + topic + '&limit::5&sort::promotions-')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (error, res) {
          if ( error ) {
            throw error;
          }

          should(res).be.an.Object;
          res.should.have.property('body');
          res.body.should.be.an.Array;

          res.body.forEach(function (problem) {
            testItem(problem, 'Problem');
          });

          if ( res.body[0] && ! problemv ) {
            testAgree(res.body[0]._id);
            testDisagree(res.body[0]._id);
            problemv = 1;
          }

          done();
        });
    });
  });
}

function testAgree (problem) {
  describe('GET agrees of problem ' + problem, function () {
    it('response with json an array of agrees', function (done) {
      request(app[1])
        .get('/json/Item/?type=Agree&parent=' + problem + '&limit::5&sort::promotions-')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (error, res) {
          if ( error ) {
            throw error;
          }

          should(res).be.an.Object;
          res.should.have.property('body');
          res.body.should.be.an.Array;

          res.body.forEach(function (agree) {
            testItem(agree, 'Agree');
          });

          done();
        });
    });
  });
}

function testDisagree (problem) {
  describe('GET disagrees of problem ' + problem, function () {
    it('response with json an array of disagrees', function (done) {
      request(app[1])
        .get('/json/Item/?type=Disagree&parent=' + problem + '&limit::5&sort::promotions-')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (error, res) {
          if ( error ) {
            throw error;
          }

          should(res).be.an.Object;
          res.should.have.property('body');
          res.body.should.be.an.Array;

          res.body.forEach(function (disagree) {
            testItem(disagree, 'Disagree');
          });

          done();
        });
    });
  });
}
