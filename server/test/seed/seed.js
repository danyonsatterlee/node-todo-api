const{Todo}= require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
    _id: userOneId,
    email: 'danyon@example.com',
    password: 'userOnePass',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access:'auth'}, 'abc').toString()
        }]
    },
    {
        _id : userTwoId,
        email: 'ty@example.com',
        password: 'userTwoPass',
    }
]

const todos = [

    {
        text: 'test 1',
        _id: new ObjectID()

    },
    {
        text: 'test 2',
        _id: new ObjectID(),
        completedAt : 333
    }
];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos)
    }).then(()=> done());
}

const populateUsers = (done)=>{
    User.remove({}).then(()=> {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
        

    }).then(()=>done())
}

module.exports={
    todos,
    populateTodos,
    users,
    populateUsers
}