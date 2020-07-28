var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var food_infoSchema = new Schema({
  name: String,
  food_info: String,
});

module.exports = mongoose.model("food_info", food_infoSchema);
