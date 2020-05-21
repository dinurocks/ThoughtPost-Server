var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("./connectionRegistration");
var { Register } = require("./models/collectionRegistration");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var myMiddlewares = require("./middlewares/auth");
var { Post } = require("./models/reactAppTwitterCollection");
var postRoute = require("./Routes/postRoute");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Origin, X-Requested-With, Accept,auth"
  );

  res.setHeader("Access-Control-Expose-Headers", "auth");
  next();
});
// CORS
app.use("/", postRoute);
// app.use(myMiddlewares.auth);

// axios.get("http://localhost:3003/getSomething", {params: {}})
// axios.post("http://localhost:3003/postSomething", {}).then().catch()

app.post("/postSomething", (req, res) => {
  var data = new Register({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    token: "",
  });

  data
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

app.get("/getSomething", (req, res) => {
  Register.find({})
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.put("/loginCheck", (req, res) => {
  Register.findOne({ mobile: req.body.mobile })
    .then((user) => {
      bcrypt.compare(req.body.password, user.password, (err, success) => {
        if (err) {
          return res.status(400).send({ message: "Password Checking Error" });
        }
        if (!success) {
          return res.status(400).send("Wrong password");
        }
        let token = jwt.sign({ key: user._id }, "*");
        Register.updateOne(
          { _id: user._id },
          {
            token: token,
          }
        )
          .then((result) => {
            res.status(200).header("auth", token).send({
              message: "Session Started Successfully",
              userid: user._id,
              name: user.name,
              email: user.email,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Could not create session" });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Find One Error");
    });
});

app.get("/getUserId", (req, res) => {
  Register.updateOne(
    { _id: req.query.id },
    {
      token: null,
    }
  )
    .then((result) => {
      res.status(200).send({ message: "Session expired" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "error while expiring session" });
    });
});

app.put("/updatePasswordByID", (req, res) => {
  Register.updateOne(
    { _id: req.body.id },
    {
      password: req.body.password,
    }
  )
    .then((result) => {
      res.status(200).send({ message: "Password updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "error while updating password" });
    });
});

app.delete("/deleteUser", (req, res) => {
  Post.deleteOne({ _id: req.body.id })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post("/updateUserFollowing", (req, res) => {
  Register.findOne({ _id: req.body.id })
    .then((result) => {
      const followUserName = req.body.followUserName;
      if (result) {
        if (result.following.find((user) => user.username === followUserName)) {
          result.following = result.following.filter(
            (user) => user.username !== followUserName
          );
        } else {
          result.following.push({
            username: followUserName,
            userId: req.body.userId,
          });
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
      console.log("couldnot find user for following");
    });
});

app.post("/updateSharedPosts", (req, res) => {
  Register.findOne({ _id: req.body.id })
    .then((result) => {
      const postId = req.body.postId;
      const sharedBy = req.body.sharedBy;
      const userId = req.body.sharedById;
      if (result) {
        result.sharedPosts.push({
          postId: postId,
          userName: sharedBy,
          userId: userId,
          sharedTime: new Date(),
        });

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
      console.log("couldnot find user for following");
    });
});

app.get("/profileInfo", (req, res) => {
  Register.findOne({ _id: req.query.id })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

app.get("/updateProfileInfo", (req, res) => {
  Register.updateOne(
    { _id: req.query.id },
    {
      name: req.query.name,
      email: req.query.email,
      mobile: req.query.mobile,
    }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

app.get("/updateUserFollowingName", (req, res) => {
  Register.updateMany(
    { "following.userId": req.query.id },
    {
      $set: {
        "following.$.username": req.query.name,
      },
    }
  )

    .then((result) => {
      console.log("updated following");
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

app.listen(3003, () => {
  console.log("Server Started");
});
