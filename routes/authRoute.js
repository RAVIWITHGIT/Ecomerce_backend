const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
  updateProfileController,
  getOrderController,
  getAllOrdersController,
  orderStatusController,
  userController,
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/test", requireSignIn, isAdmin, testController);
router.get("/getAllUser", requireSignIn, isAdmin, userController);
router.post("/forgetPassword", forgetPasswordController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update Profile
router.put("/profile", requireSignIn, updateProfileController);

//Orders for user
router.get("/orders", requireSignIn, getOrderController);

//Order Route for admin
router.get("/AllOrders", requireSignIn, isAdmin, getAllOrdersController);

//order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

// export default router;
module.exports = router;
