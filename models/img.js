var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgSchema = new Schema({
    name: String,
    file_name: String
});

module.exports = mongoose.model('img', imgSchema);