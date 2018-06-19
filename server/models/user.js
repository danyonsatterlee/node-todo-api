var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        require:true,
        minlength:1,
        trim: true
    },
    name: {
        type: String,
        require:true,
        trim:true,
        minlength:1
    }
});

module.exports = {User};
