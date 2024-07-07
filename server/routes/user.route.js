/**
 * @route /api/v1/users
 */
const { Router } = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getLoggedUser,
  updateLoggedUser,
  updateLoggedUserPassword,
  deleteLoggedUser,
  uploadProfileImage,
  resizeProfileImage,
} = require("../controller/user.controller");
const { protect, allowedRoles } = require("../services/auth.service");
const {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserValidator,
  updateUserPasswordValidator,
  updateUserValidator,
} = require("../utils/validations/user.validation");

const router = Router();

// protected
router.use(protect);

router.get("/getMe", getLoggedUser, getUser);
router.put(
  "/updateMe",
  uploadProfileImage,
  resizeProfileImage,
  updateLoggedUserValidator,
  updateLoggedUser,
  updateUser
);
router.put(
  "/changeMyPassword",
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.delete("/deleteMe", deleteLoggedUser);

// private [admin]
router.use(allowedRoles("admin"));

router
  .route("/")
  .get(getAllUsers)
  .post(
    uploadProfileImage,
    resizeProfileImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadProfileImage, resizeProfileImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put(
  "/changePassword/:id",
  updateUserPasswordValidator,
  updateUserPassword
);

module.exports = router;
