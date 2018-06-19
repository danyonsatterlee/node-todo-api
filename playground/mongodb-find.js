const {MongoClient, ObjectID} = require ('mongodb');




MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
         return console.log('unable to connect to mongodb server');
    }
    // console.log('connected to mongodb server');
    // db.collection('todos').find().toArray().then((doc)=>{
    //     console.log('todos');
    // console.log(JSON.stringify(doc,undefined,2))
    
    // },(err)=>{
    //     conosole.log('unable to fetch to dos', err)
    // })
    console.log('connected to mongodb server');
    db.collection('users').find({name: 'danyon'}).toArray().then((doc)=>{
        console.log(JSON.stringify(doc,undefined,2))
    
    },(err)=>{
        conosole.log('unable to fetch to dos', err)
    })
    // db.close();
});