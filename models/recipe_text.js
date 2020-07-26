var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipe_textSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    text_steps: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('recipe_text', recipe_textSchema);