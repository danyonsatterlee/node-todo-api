const {MongoClient, ObjectID} = require ('mongodb');




MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
         return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongodb server');

    // db.collection('todos').insertOne({
    //     text:'something to do',
    //     completed: false
    // },(err,results)=>{
    //     if(err){
    //         return console.log('unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(results.ops, undefined, 2))

    // });
// insert new dog into user (name, age, location)

// db.collection('users').insertOne({

//     name: 'danyon',
//     age: 88,
//     location: 'denver'

// }, (err, results)=>{
//     if(err){
//         return console.log('could not insert new user', err);
//     }
//     console.log(JSON.stringify(results.ops[0]._id.getTimestamp()));
// })
    db.close();
});