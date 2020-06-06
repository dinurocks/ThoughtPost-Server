var mongoose = require("mongoose");
schema = mongoose.Schema({
  postId: { type: String },
  imageUrl: { type: String },
});

var postImages = mongoose.model("postImages", schema);
module.exports = { postImages };
