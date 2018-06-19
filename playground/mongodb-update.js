const {
    MongoClient,
    ObjectID
} = require('mongodb');




MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongodb server');
    db.collection('users').findOneAndUpdate({
        _id: new ObjectID('5b2830fb68fabe64a1c18b02')
    }, {
        $set: {
            name: 'danyon'
        },
        $inc:{
            age: -2
        }
      
    }, {
        returnOrignal: false
    }).then((result) => {
        console.log(result);
    });



    // db.close();
});