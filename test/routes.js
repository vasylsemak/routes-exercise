/* eslint-disable no-unused-expressions */

const supertest = require('supertest-as-promised')(require('../app'));
const expect = require('chai').expect;
const todos = require('../models/todos');

describe('Todo routes', () => {
  beforeEach(() => {
    todos.reset();
  });

  describe('`/users` URI', () => {
    it('GET responds with an empty array at first', () => {
      // when we make requests to `/users` we will get back an empty array
      return supertest // supertest object lets us make & test HTTP req/res
        .get('/users') // makes an HTTP request: GET '/users'
        .expect(200) // tests response status code
        .expect('Content-Type', /json/) // tests response header
        .expect(res => {
          expect(res.body).to.eql([]); // tests response body
        });
    });

    it('GET responds with a person after a task has been added', () => {
      todos.add('zeke', { content: 'a task' });
      return supertest
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.eql(['zeke']);
        });
    });

    it('GET responds with everyone who has tasks', () => {
      todos.add('zeke', { content: 'a task' });
      todos.add('omri', { content: 'some other task' });
      todos.add('gabe', { content: 'yet more tasks' });
      return supertest
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.eql(['zeke', 'omri', 'gabe']);
        });
    });
  });

  describe('`/users/:name/tasks` URI', () => {
    it('GET lists all tasks for a specific user', () => {
      todos.add('dave', { content: 'task 1 for dave' });
      todos.add('joe', { content: 'task 1 for joe', complete: true });
      todos.add('joe', { content: 'task 2 for joe' });
      return supertest
        .get('/users/joe/tasks')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.have.length(2);
          expect(res.body[0].content).to.equal('task 1 for joe');
          expect(res.body[0].complete).to.be.true;
          expect(res.body[1].content).to.equal('task 2 for joe');
          expect(res.body[1].complete).to.be.false;
        });
    });

    it('POST creates a new task for that user & responds with the created task', () => {
      todos.add('sarah', { content: 'task 1 for sarah' });
      todos.add('sarah', { content: 'task 2 for sarah' });
      return supertest
        .post('/users/sarah/tasks')
        .send({ content: 'a new task for sarah' }) // the HTTP request body
        .expect(201) // you'll have to customize the status yourself
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.eql({
            content: 'a new task for sarah',
            complete: false,
          });
          expect(todos.list('sarah')).to.have.length(3);
          expect(todos.list('sarah')[2]).to.eql({
            content: 'a new task for sarah',
            complete: false,
          });
        });
    });

    it('POST respects pre-existing completion status', () => {
      return supertest
        .post('/users/sarah/tasks')
        .send({ content: 'a new task for sarah', complete: true }) // the HTTP request body
        .expect(201) // you'll have to customize the status yourself
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.eql({
            content: 'a new task for sarah',
            complete: true,
          });
          expect(todos.list('sarah')).to.have.length(1);
          expect(todos.list('sarah')[0]).to.eql({
            content: 'a new task for sarah',
            complete: true,
          });
        });
    });

    describe('query filtering (?key=value)', () => {
      beforeEach(() => {
        todos.add('billy', { content: 'learn about req.query' });
        todos.complete('billy', 0);
        todos.add('billy', { content: 'enable requests for specific todos' });
      });

      it('GET can get just the completed tasks', () => {
        return supertest
          .get('/users/billy/tasks?status=complete')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(res => {
            expect(res.body).to.have.length(1);
            expect(res.body[0].content).to.equal('learn about req.query');
          });
      });

      it('GET can get just the active (incomplete) tasks', () => {
        return supertest
          .get('/users/billy/tasks?status=active')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(res => {
            expect(res.body).to.have.length(1);
            expect(res.body[0].content).to.equal(
              'enable requests for specific todos'
            );
          });
      });
    });

    describe('`/:index` URI', () => {
      it('PUT marks a specific task as complete', () => {
        todos.add('nimit', { content: 't0' });
        todos.add('nimit', { content: 't1' });
        todos.add('nimit', { content: 't2' });

        return supertest
          .put('/users/nimit/tasks/1')
          .expect(200)
          .expect(() => {
            expect(todos.list('nimit')[0].complete).to.be.false;
            expect(todos.list('nimit')[1].complete).to.be.true;
            expect(todos.list('nimit')[2].complete).to.be.false;
          });
      });

      it('DELETE removes a specific task', () => {
        todos.add('david', { content: 'interview fellows' });
        todos.add('david', { content: 'judge stackathon' });
        todos.add('david', { content: 'code review' });

        return supertest
          .delete('/users/david/tasks/1')
          .expect(204)
          .expect(() => {
            expect(todos.list('david')).to.have.length(2);
            expect(todos.list('david')[0].content).to.equal(
              'interview fellows'
            );
            expect(todos.list('david')[1].content).to.equal('code review');
          });
      });
    });

    describe('error handling', () => {
      it('responds with a 404 if a user does not exist', () => {
        return supertest.get('/users/obama/tasks').expect(404);
      });

      it('responds with a 400 if you attempt to add a todo without content', () => {
        return supertest
          .post('/users/bob/tasks')
          .send({ content: '' })
          .expect(400);
      });
    });
  });
});
