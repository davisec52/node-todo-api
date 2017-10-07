const expect = require("expect");
const testRequest = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/todos");

const todos = [{"text": "Rescue neighbor from Jocie"}, {"text": "Teach Caleb Zen of tennis balls"}, {"text": "Kill the landlord"}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos).then(() => done());
	})
	
});

describe("POST /todos", () => {
	it("should create post new todo item", (done) => {
		let text = "test string";
		console.log("The test text string: ", text);

		testRequest(app)
			.post("/todos")
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				Todo.find({text}).then((allTodos) => {
					expect(allTodos.length).toBe(1);
					expect(allTodos[0].text).toBe(text);
					done();
				}).catch((err) => done(err));
			});
	});


	it('should not create todo with invalid body data', (done) => {
	    testRequest(app)
	      .post('/todos')
	      .send({})
	      .expect(400)
	      .end((err, res) => {
	        if (err) {
	          return done(err);
	        }

	        Todo.find().then((allTodos) => {
	          expect(allTodos.length).toBe(3);
	          done();
	        }).catch((e) => done(e));
	      });
  	});
});

/*describe("GET /todos", () => {
	it("should collect an array of all todos", (done) => {
		testRequest(app)
			.get("/todos")
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(3);
			})
			.end(done);
	});
});*/

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    testRequest(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.allTodos.length).toBe(3);
      })
      .end(done);
  });
});

/*
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});*/