var mongoose = require("mongoose");
var pageSchema = mongoose.Schema({
   page: String,
   count: Number
});
module.exports = mongoose.model("Page", pageSchema);