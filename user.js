import express from "express";
import path    from "path";
import multer  from "multer";

import home     from "../controllers/user/home.js";
import services from "../controllers/user/services.js";
import shop     from "../controllers/user/shop.js";
import userCtrl from "../controllers/user/user.js";
import profileCtrl from "../controllers/user/profile.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

// Multer config for user uploads
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "public", "uploads", "users"),
  filename:   (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png/.test(file.mimetype);
    cb(ok ? null : new Error("Only JPG/PNG allowed"), ok);
  }
});

// Protect all /user routes
router.use(userAuth);

// Existing user endpoints
router.get("/:id", home.home_get);
router.get("/:id/services", services.services_get);
router.get("/:id/shop", shop.shop_get);
router.put("/:id/cart", userCtrl.addToCart_put);

// Profile page routes
router.get("/:id/profile",           profileCtrl.profile_get);
router.post(
  "/:id/profile",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "albums",          maxCount: 10 }
  ]),
  profileCtrl.profile_post
);

export default router;
