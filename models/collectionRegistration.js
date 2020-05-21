var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
    min: 6000000000,
    max: 9999999999,
  },

  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    // unique:true
  },
  following: [
    {
      username: { type: String },
      userId: { type: String },
    },
  ],
  sharedPosts: [
    {
      postId: { type: String },
      userName: { type: String },
      userId: { type: String },
      sharedTime: { type: String },
    },
  ],
});

schema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) {
    next();
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(400).send({ message: "err while gensalt" });
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return res.status(400).send({ message: "err while gensalt in hash" });
        }
        user.password = hash;
        next();
      });
    });
  }
});

var Register = mongoose.model("Register", schema);
module.exports = { Register };
