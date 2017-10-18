const expect = require("expect");
const testRequest = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todos");
const {User} = require("./../models/users");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");


// Runs before each instance of running a test
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe("PATCH /todos/:id", () => {
	it("should update item by id", (done) =>{
		let id = todos[1]._id.toHexString();
		todos[1].text = "Teach dogs to spell";
		let item = todos[1];
		testRequest(app)
			.patch(`/todos/${id}`)
			.send(item)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completed).toBe(todos[1].completed);
				expect(res.body.todo.text).toBe(item.text);
				expect(res.body.todo.completedAt).toBeA("number");
			})
			.end((err, res) => {
				if(err) {
					done(err);
				}
				done();
			});
	});

	it("should update item by id", (done) =>{
		let id = todos[1]._id.toHexString();
		todos[1].text = "Teach dogs to play backgammon";
		todos[1].completed = false;
		let item = todos[1];
		testRequest(app)
			.patch(`/todos/${id}`)
			.send(item)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completed).toBe(todos[1].completed);
				expect(res.body.todo.text).toBe(item.text);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end((err, res) => {
				if(err) {
					done(err);
				}
				done();
			});
	});

});

describe("/users/me", () => {
	it("should return 200 when user authenticated", (done) => {
		testRequest(app)
			.get("/users/me")
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
					expect(res.body._id).toBe(users[0]._id.toHexString());
					expect(res.body.email).toBe(users[0].email);
				
			})
			.end(done);
	});

	it("should return a 401 when user fails authentication", (done) => {
		testRequest(app)
			.get("/users/me")
			.set("x-auth", "123abc") //set unnecesscary for test. It is there for drramatization
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}
				done();
			});
	});
});

describe("POST /users", () => {
	it("should return 200 when user signup successful", (done) => {
		let email = "user@dog.com";
		let password = "poiuyt";

		testRequest(app)
			.post("/users")
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers["x-auth"]).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);

			})
			.end((err) => {
				if(err) {
					return done(err);
				}
				User.findOne({email}).then((user) => {
					console.log(user);
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				});
			});
	});

	it("should return validation errors if user data invalid", (done) => {
		let email = "user@dog.com";
		let password = "asburypark";

		testRequest(app)
			.post("/users")
			.send({email: "user@dog", password: "asb"})
			.expect(400)
			.expect((res) => {
				expect(res.body.email).toNotBe(email);
				expect(res.body.password).toNotBe(password);
			})
			.end((err) => {
				if(err) {
					return done(err);
				}
				done();
			}) 
	});

	it("should not create user if email in use", (done) => {
		let email = "monkey1@dog.com";
		let password = "q034tGLASKG";

		testRequest(app)
			.post("/users")
			.send({email, password})
			.expect(400)
			.end(done);
	});
});



