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
			.set("x-auth", users[0].tokens[0].token)
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
	      .set("x-auth", users[0].tokens[0].token)
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
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.allTodos.length).toBe(1);
			})
			.end(done);
	});
});

describe("Get /todos/:id", () => {
	it("should return a single todo by id", (done) => {
		testRequest(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.item.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it("should not return a todo created by different user", (done) => {
		testRequest(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should return a 404 with if not found", (done) => {
		testRequest(app)
			.get(`/todos/${ObjectID().toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	}, err => {res.status(404).send(err)});

	it("should return a 404 for non standard object Ids", (done) => {
		testRequest(app)
			.get(`/todos/${todos[0]._id.toHexString()}xyz`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end((err, res) => {if(err) {console.log(err);} done()});
	}, err => {res.status(404).send(err)});

});

describe("DELETE /todos/:id", () => {
	it("should delete a single todo item by Id", (done) => {
		testRequest(app)
			.delete(`/todos/${todos[0]._id.toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(202)
			.expect((res) => {
				expect(res.body.todo._id).toBe(`${todos[0]._id.toHexString()}`)
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				Todo.findById(`${todos[0]._id.toHexString()}`).then((todo)=> {
					expect(todo).toBeFalsy();
					done();
				}).catch((e) => done(e));

			});
	});

	it("should not delete a todo created by some other user", (done) => {
		testRequest(app)
			.delete(`/todos/${todos[1]._id.toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				Todo.findById(`${todos[0]._id.toHexString()}`).then((todo)=> {
					expect(todo).toBeTruthy();
					done();
				}).catch((e) => done(e));

			});
	});

	it("should return a 404 with if not found", (done) => {
		testRequest(app)
			.delete(`/todos/${ObjectID().toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	}, err => {res.status(404).send(err)});

	it("should return a 404 for non standard object Ids", (done) => {
		testRequest(app)
			.delete(`/todos/${todos[0]._id.toHexString()}xyz`)
			.set("x-auth", users[0].tokens[0].token)
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
			.set("x-auth", users[1].tokens[0].token)
			.send(item)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completed).toBe(todos[1].completed);
				expect(res.body.todo.text).toBe(item.text);
				//expect(res.body.todo.completedAt).toBeA("number");
				expect(typeof res.body.todo.completedAt).toBe("number");
			})
			.end((err, res) => {
				if(err) {
					done(err);
				}
				done();
			});
	});

	it("should not update item when some other user attempts update", (done) =>{
		let id = todos[1]._id.toHexString();
		let text = "Teach dogs to spell";
		let item = todos[1];
		testRequest(app)
			.patch(`/todos/${id}`)
			.set("x-auth", users[0].tokens[0].token)
			.send({completed: true, text})
			.expect(404)
			.end(done)
	});

	it("should clear completedAt when completed set to false", (done) =>{
		let id = todos[1]._id.toHexString();
		todos[1].text = "Teach dogs to play backgammon";
		todos[1].completed = false;
		let item = todos[1];
		testRequest(app)
			.patch(`/todos/${id}`)
			.set("x-auth", users[1].tokens[0].token)
			.send(item)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completed).toBe(todos[1].completed);
				expect(res.body.todo.text).toBe(item.text);
				expect(res.body.todo.completedAt).toBeFalsy();
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
				expect(res.headers["x-auth"]).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);

			})
			.end((err) => {
				if(err) {
					return done(err);
				}
				User.findOne({email}).then((user) => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				});
			});
	});

	it("should return validation errors if request invalid", (done) => {
		let email = "user@dog.com";
		let password = "asburypark";

		testRequest(app)
			.post("/users")
			.send({email: "user@dog", password: "asb"})
			.expect(400)
			.end(done)
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

describe("POST /users/login", () => {
	it("should login user and return x-auth token", (done) => {
		let email = users[1].email;
		let password = users[1].password;
		testRequest(app)
			.post("/users/login")
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers["x-auth"]).toBeTruthy();
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}
					User.findOne({email}).then((user) => {
						expect(user.password).not.toBe(res.body.password);
						expect(user.toObject().tokens[1]).toMatchObject({
							access: "auth",
							token: res.headers["x-auth"]
						});
						done();
					}).catch((err) => done(err));
				
			});
	});

	it("should reject an invalid login", (done) => {
		let email = users[1].email;
		let password = users[0].password;
		testRequest(app)
			.post("/users/login")
			.send({email, password})
			.expect(400)
			.expect((res) => {
				expect(res.headers["x-auth"]).toBeFalsy()
			})
			.end((err, res) => {
				if(err) {
					done(err);
				}
				User.findOne({email}).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch((err) => done(err));
			});
	});

});

describe("DELETE /users/me/token", () => {
	it("should verify token of user has been deleted", (done) => {
		testRequest(app)
			.delete("/users/me/token")
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.header["x-auth"]).toBeFalsy();
				expect(res.body.tokens).toBeFalsy();
			})
			.end((err, res) => {
				if(err) {
					done(err);
				}else {
					User.findById({_id: users[0]._id}).then((user) => {
						expect(user.tokens.length).toBe(0)
					});
					done();
				}
			});
	})
});



