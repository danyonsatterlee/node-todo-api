const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const{Todo}= require('../models/todo');
const{User}= require('../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST/todos', ()=>{
    it('should create a new todo', (done) =>{
        var text = 'test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)
            })
            .end((err, res)=>{
                if(err){
                   return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) =>done(err));
            })
    });
    it('shoudl not create todo with invalid body data', (done)=>{
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2)
                    done();       
                }).catch((err) =>done(err));
            })
        });
        
});

// GET TESTS

describe('GET /todos', ()=>{
    it('should get all todos', (done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

// GET TEST BY ID

describe(' GET BY ID /todo/:id', ()=>{
    it('should get one todo', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });
    it('should get one todo with 404 if todo not found', (done)=>{
        var newId = new ObjectID().toHexString();
        request(app)
        .get('/todos/:newId')
        .expect(404)
        .end(done);
    });
    it('should get one todo with 404 for non-object ids', (done)=>{
        request(app)
        .get('/todos/123454')
        .expect(404)
        .end(done);
    });
});


//REMOVE TEST BY ID

describe(' DELETE /todos/:id', ()=>{
    it('should remove a todo', (done) =>{
        var newId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${newId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(newId)
        })
        .end((err, res)=>{
            if(err){
                return done(err)
            }
            Todo.findById(newId).then((todo)=>{
                expect(todo).toBeFalsy();
                done();
            }).catch((e)=>done(e))
        })

    });

    it('should return a 404 if todo not found', (done) =>{
        var newId = new ObjectID().toHexString();
        request(app)
        .delete('/todos/:newId')
        .expect(404)
        .end(done);

    });
    it('should return 404 if object id is invalid', (done) =>{
        request(app)
        .delete('/todos/123454')
        .expect(404)
        .end(done);

    });
});

// PATCH TEST CASES

describe('PATCH /todos/:id', ()=>{
    it('should update the todo', (done)=>{
 
        var hexId = todos[0]._id.toHexString();
        var text= 'i have been updated again';
      
        request(app)
        .patch(`/todos/${hexId}`)
        
        .send({
            completed: true,
            text
        })

            .expect(200)
            .expect((res)=>{
                
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(true)
                expect(typeof res.body.todo.completedAt).toBe('number')
            })
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done)=>{

        var hexId = todos[1]._id.toHexString();
        var text= 'i have been updated again 2';
      
        request(app)
        .patch(`/todos/${hexId}`)
        
        .send({
            completed: false,
            completedAt: null,
            text
        })

            .expect(200)
            .expect((res)=>{
                
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

describe('GET /users/me', ()=>{
    it('should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                var  userId = users[0]._id.toHexString()
                expect(res.body._id).toBe(userId)
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done)=>{
        var newId = new ObjectID().toHexString();
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end(done);

    });
});

describe('POST /users', ()=>{
    it('should create a user', (done)=>{
        var email = 'example@example.com'
        var password = '123asdf!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy()
                expect(res.body._id).toBeTruthy()
                expect(res.body.email).toBe(email)  
            })
            .end((err) =>{
                if(err){
                    return done(err)
                }

                User.findOne({email}).then((user)=>{
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password)
                    done();
                });  
            });
    });


    it('should return validation errors if request invalid', (done)=>{
        var email = 'exaxample.com'
        var password = '123asdf!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            done();
    });

    it('should not create user if email in use', (done)=>{
        var email = users[0],email
        var password = '123asdf!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            done();
    });
})


describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          
          User.findById(users[1]._id).then((user) => {
            expect(user.toObject().tokens[0]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e));
        });
    });

    it('should reject invalid login', (done) =>{
        request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: 'bogus'
        })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0)
   
            done();
          }).catch((e) => done(e));
        });
           
    });
});


describe('DELETE /users/me/token', () => {
    it('shoulod remove auth token on logout', (done) => {
        var token = users[0].tokens[0].token
       
        request(app)
        .delete('/users/me/token')
        .set('x-auth', token)
        .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            
            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0)
                done();
            }).catch((e) => done(e));
        });
    });
});
   
