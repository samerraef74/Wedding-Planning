import express from "express";

import { signIn_get, signIn_post } from "../controllers/registration/signin.js";
import { signUp_get, signUp_post } from "../controllers/registration/signUp.js";
import { forgetPassword_get, forgetPassword_post } from "../controllers/registration/forgetPassword.js";
import { changePassword_get, changePassword_post } from "../controllers/registration/changePassword.js";
import multer from "multer";
import path    from "path";


const router = express.Router();

// ─── Multer config for signup avatars ─────────────────────────
const signupStorage = multer.diskStorage({
  destination: path.join(process.cwd(), "public", "uploads", "users"),
  filename:   (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  }
});

const signupUpload = multer({
  storage: signupStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png/.test(file.mimetype);
    cb(ok ? null : new Error("Only JPG/PNG allowed"), ok);
  }
});

// ─── Registration Routes ───────────────────────────────────────
router.get("/signin", signIn_get);
router.post("/signin", signIn_post);

router.get("/signup", signUp_get);
router.post("/signup", signupUpload.single("profilePicture"), signUp_post);

router.get("/forgetpassword", forgetPassword_get);
router.post("/forgetpassword", forgetPassword_post);

router.get("/changepassword/:id", changePassword_get);
router.post("/changepassword/:id", changePassword_post);

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

export default router;