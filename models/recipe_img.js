var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipe_imgSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    img_steps: { type: Array }
});

module.exports = mongoose.model('recipe_img', recipe_imgSchema);