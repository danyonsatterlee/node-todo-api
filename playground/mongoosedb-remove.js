const {MongoClient, ObjectID} = require ('mongodb');

var {mongoose} = require('../server/db/mongoose');
var{Todo} = require("../server/models/todo");


// MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
//     if(err){
//          return console.log('unable to connect to mongodb server');
//     }
//     console.log('connected to mongodb server');
  
    // Todo.remove({}).then((result)=>{
    //     console.log(result);
    // })
//return the removed item so you can see it
// so does find by id
    Todo.findOneAndRemove({text:"eat food"}).then((todo)=>{
        console.log(todo)
    })
// });