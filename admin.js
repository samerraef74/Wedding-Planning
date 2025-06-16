import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

import dashboard from "../controllers/admin/dashboard.js";
import users from "../controllers/admin/users.js";
import chats from "../controllers/admin/chats.js";
import products from "../controllers/admin/products.js";
import services from "../controllers/admin/services.js";

// Set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

// Check file type
function checkFileType(file, cb) {
  // Allowed file types
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.get("/:id/", dashboard.dashboard_get);

router.get("/:id/users", users.users_get);
router.post("/user", users.users_post);
router.delete("/user/:userId", users.users_delete);

router.get("/:id/products", products.products_get);
router.post("/product", products.createProduct_post);
router.post("/upload/image", upload, products.uploadImage_post); // Use 'upload' middleware here
router.delete("/product/:productId", products.deleteProductById_delete);

router.get("/:id/services", services.services_get);
router.post("/service", services.createService_post);
router.delete("/service/:serviceId", services.deleteServiceById_delete);

router.get("/:id/chats", chats.chat_get);

export default router;
