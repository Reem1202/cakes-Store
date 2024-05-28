const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/userController");

userRouter.get("/", UserController.home);
userRouter.get("/register", UserController.showRegistrationForm);
userRouter.post("/register", UserController.registerUser);
userRouter.get("/verify", UserController.verifyEmail);
userRouter.get("/login", UserController.showLoginForm);
userRouter.post("/login", UserController.loginUser);
userRouter.get("/forgot-password", UserController.forgotPassword);
userRouter.post("/check-email", UserController.MailCheck);
userRouter.get("/resend-otp", UserController.OTPResend);
userRouter.post("/verify-otp/:id", UserController.VerifyOTP);
userRouter.post("/change-password/:id", UserController.ChangePassword);
userRouter.get("/about", UserController.AboutPage);
userRouter.get("/contact", UserController.Contact);
userRouter.post("/search", UserController.searchBar);
userRouter.get("/logout", UserController.logout);
module.exports = userRouter;
