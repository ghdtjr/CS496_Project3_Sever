var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    password: String,
    first_name: String,
    last_name: String,
    email: String,
    food_list: {
        type: String, default: ''
    }
});

module.exports = mongoose.model('user', userSchema);