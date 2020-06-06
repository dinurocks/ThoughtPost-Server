var { Post } = require("../models/reactAppTwitterCollection");
var { Register } = require("../models/collectionRegistration");
var { postImages } = require("../models/postImageCollection");

module.exports.saveUserPost = (req, res) => {
  // http://localhost:3003/static/
  console.log("file", req.file);
  // const obj = JSON.parse(JSON.stringify(req.body));
  console.log("body", req.body);
  if (req.file) {
    // var newn = "http://localhost:3003/static/" + req.file.originalname;
  }

  Register.findOne({ _id: req.body.id })
    .then((userreg) => {
      var post = new Post({
        user: userreg.name,
        userId: req.body.id,

        post: req.body.post,

        // postImage: req.file ? newn : null,
        postImage: req.file ? req.file.filename : null,

        time: new Date(),
        likeCount: 0,
      });

      post
        .save()
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
};

module.exports.getUserPost = (req, res) => {
  Post.find({})
    .sort({ time: "desc" })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports.updatePostLike = (req, res) => {
  Post.findOne({ _id: req.body.id })
    .then((result) => {
      const username = req.body.userLikedName;
      let likePostCount = result.likeCount;

      if (result) {
        if (result.likes.find((like) => like.username === username)) {
          result.likes = result.likes.filter(
            (like) => like.username !== username
          );
          result.likeCount = likePostCount - 1;
        } else {
          result.likes.push({
            username: username,
          });
          result.likeCount = likePostCount + 1;
        }
        result
          .save()
          .then((value) => {
            res.status(200).send(value);
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    })
    .catch((err) => {
      console.log("Post not found");
    });
};

module.exports.updatePostUserName = (req, res) => {
  Post.updateMany(
    { userId: req.query.id },
    {
      user: req.query.name,
    }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports.getPostImages = (req, res) => {
  postImages
    .find({})
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
