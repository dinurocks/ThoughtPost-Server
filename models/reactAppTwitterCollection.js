var mongoose = require("mongoose");
schema = mongoose.Schema({
  user: { type: String },
  userId: { type: String },
  post: { type: String },
  postImage: { type: String },
  time: { type: String },
  likes: [
    {
      username: { type: String },
    },
  ],
  likeCount: { type: Number },
});

var Post = mongoose.model("posts", schema);
module.exports = { Post };
