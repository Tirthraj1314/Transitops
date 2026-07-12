import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);
router.put("/change-password", changePassword);

export default router;