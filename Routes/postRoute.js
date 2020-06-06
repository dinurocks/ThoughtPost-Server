var express = require("express");
var router = express.Router();
var controller = require("../Controllers/postController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./images",
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
}).single("myImage");

router.post("/feedPost", upload, controller.saveUserPost);
router.get("/getUserPosts", controller.getUserPost);
router.post("/updatePostLike", controller.updatePostLike);
router.get("/updatePostUserName", controller.updatePostUserName);
router.get("/getPostImages", controller.getPostImages);
module.exports = router;
