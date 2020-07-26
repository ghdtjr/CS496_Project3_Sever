var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingredientsSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    ingredients: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('ingredients', ingredientsSchema);