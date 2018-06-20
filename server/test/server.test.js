const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const{Todo}= require('../models/todo');
const {ObjectID} = require('mongodb');

const todos = [

    {
        text: 'test 1',
        _id: new ObjectID()
    },
    {
        text: 'test 2',
        _id: new ObjectID()
    }
];


beforeEach((done)=>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos)
    }).then(()=> done());
});
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
})