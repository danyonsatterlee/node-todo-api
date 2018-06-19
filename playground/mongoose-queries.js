const{ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');

const {Todo} = require('../server/models/todo');

var id = '5b29625f1075f170d520217ff';
if(!ObjectID.isValid(id)){
    console.log('Id not valid');
}
// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('todos', todos);
// });

// Todo.findOne({
//     completed:false
// }).then((todo)=>{
//     console.log('todos', todo);
// });

Todo.findById(id).then((todo)=>{
    if(!todo){
        return console.log('Id not found');
    }
    console.log('todo by id: ', todo);
}).catch((err)=>console.log(err));