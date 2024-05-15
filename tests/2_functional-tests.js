/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id_to_delete = ""
let id_request = ""

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
         .keepOpen()
         .post('/api/books')
         .send({
          title: 'story of boby'
         })
         .end((err, res) => {
          id_to_delete = res.body._id;
          id_request = "/api/books/" + id_to_delete;
          assert.containsAllDeepKeys(res.body, {
            title: 'story of boby'
          })
         })
        done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
         .keepOpen()
         .post('/api/books')
         .send({})
         .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'missing required field title'
          })
         })
        done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
         .keepOpen()
         .get('/api/books')
         .end((err, res) => {
          assert.isArray(res.body);
         })
        done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .keepOpen()
         .get('/api/books/1234')
         .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'no book exists'
          })
         })
        done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .keepOpen()
         .get(id_request)
         .end((err, res) => {
          assert.deepEqual(res.body, {
            title: 'story of boby',
            _id: id_to_delete,
            comments: []
          })
         })
        done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
         .keepOpen()
         .post(id_request)
         .send({comment: 'hello boby'})
         .end((err, res) => {
          assert.deepEqual(res.body, {
            title: 'story of boby',
            _id: id_to_delete,
            comments: ['hello boby']
          })
         })
        done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
         .keepOpen()
         .post(id_request)
         .send({})
         .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'missing required field comment'
          })
         })
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
         .keepOpen()
         .post('/api/books/1234')
         .send({comment: 'i like boby'})
         .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'no book exists'
          })
         })
        done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
         .keepOpen()
         .delete(id_request)
         .end((err, res) => {
          assert.deepEqual(res.body, {
            success: 'delete successful'
          })
         })
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
         .keepOpen()
         .delete('/api/books/1234')
         .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'no book exists'
          })
         })
        done();
      });

    });

  });

});
