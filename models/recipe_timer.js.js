var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipe_timerSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    timer_steps: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('recipe_timer', recipe_timerSchema);