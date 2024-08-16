const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const upload = require("../configs/multerConfig");

router.route("/fetch-users").post(userController.fetchUsers);

router
  .route("/add-user")
  .post(upload.single("profilePic"), userController.addUser);

router.route("/delete-user").post(userController.deleteUser);

router.route("edit-user").post(userController.editUser);

module.exports = router;
