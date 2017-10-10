const expect = require("expect");
const testRequest = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todos");

const todos = [{
	"text": "Rescue neighbor from Jocie", "_id": new ObjectID()},{
	"text": "Teach Caleb Zen of tennis balls", "_id": new ObjectID()},{
	"text": "Kill the landlord", "_id": new ObjectID()
	}];

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

describe("GET /todos", () => {
	it("should collect an array of all todos", (done) => {
		testRequest(app)
			.get("/todos")
			.expect(200)
			.expect((res) => {
				expect(res.body.allTodos.length).toBe(3);
			})
			.end(done);
	});
});

describe("Get /todos/:id", () => {
	it("should return a single todo by id", (done) => {
		testRequest(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.item.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it("should return a 404 with if not found", (done) => {
		testRequest(app)
			.get(`/todos/${ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	}, err => {res.status(404).send(err)});

	it("should return a 404 for non standard object Ids", (done) => {
		testRequest(app)
			.get(`/todos/${todos[0]._id.toHexString()}xyz`)
			.expect(404)
			.end((err, res) => {if(err) {console.log(err);} done()});
	}, err => {res.status(404).send(err)});

});

describe("DELETE /todos/:id", () => {
	it("should delete a single todo item by Id", (done) => {
		testRequest(app)
			.delete(`/todos/${todos[0]._id.toHexString()}`)
			.expect(202)
			.expect((res) => {
				expect(res.body.todo._id).toBe(`${todos[0]._id.toHexString()}`)
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				Todo.findById(`${todos[0]._id.toHexString()}`).then((todo)=> {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));

			});

			
	});

	it("should return a 404 with if not found", (done) => {
		testRequest(app)
			.delete(`/todos/${ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	}, err => {res.status(404).send(err)});

	it("should return a 404 for non standard object Ids", (done) => {
		testRequest(app)
			.delete(`/todos/${todos[0]._id.toHexString()}xyz`)
			.expect(404)
			.end((err, res) => {if(err) {console.log(err);} done()});
	}, err => {res.status(404).send(err)});

});