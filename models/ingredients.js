var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingredientsSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    ingredients: { type: Array }
});

module.exports = mongoose.model('ingredients', ingredientsSchema);