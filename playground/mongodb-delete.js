const {MongoClient, ObjectID} = require ('mongodb');




MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
         return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongodb server');
    //deleteMany
    // db.collection('todos').deleteMany({text: "eat lunch"}).then((result)=>{
    //     console.log(result);
    // });
    // db.collection('users').deleteMany({name:'danyon'}).then((result)=>{
    //     console.log(result);
    // });
    //deleteOne
    // db.collection('todos').deleteOne({text: "eat one"}).then((result)=>{
    //     console.log(result)
    // })
    // db.collection('users').deleteOne({_id : new ObjectID("5b283110e0dc6564a26465f5")}).then((result)=>{
    //     console.log(result);
    // })
    //findOneandDelte
    // db.collection('todos').findOneAndDelete({collection:false}).then((result)=>{
    //     console.log(result);
    // })
    db.collection('users').findOneAndDelete()
    // db.close();
});