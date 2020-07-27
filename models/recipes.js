var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipesSchema = new Schema({
    recipes: {
        type: String,
        default: ''
    },
});

module.exports = mongoose.model('recipes', recipesSchema);