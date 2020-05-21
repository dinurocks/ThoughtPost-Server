var express = require("express");
var router = express.Router();
var controller = require("../Controllers/postController");

router.post("/feedPost", controller.saveUserPost);
router.get("/getUserPosts", controller.getUserPost);
router.post("/updatePostLike", controller.updatePostLike);
router.get("/updatePostUserName", controller.updatePostUserName);
module.exports = router;
