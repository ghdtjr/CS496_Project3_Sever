var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    name: String
});

module.exports = mongoose.model('recipe', recipeSchema);