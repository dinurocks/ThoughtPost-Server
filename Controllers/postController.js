var { Post } = require("../models/reactAppTwitterCollection");
var { Register } = require("../models/collectionRegistration");

module.exports.saveUserPost = (req, res) => {
  Register.findOne({ _id: req.body.id })
    .then((userreg) => {
      var post = new Post({
        user: userreg.name,
        userId: req.body.id,
        post: req.body.post,
        time: new Date(),
        likeCount: 0,
      });

      post
        .save()
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      console.log(res);
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
