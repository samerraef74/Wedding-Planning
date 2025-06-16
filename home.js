import express from "express";
import userAuth from "../middlewares/userAuth.js";
const router = express.Router();

import shop from "../controllers/home/shop.js";
import services from "../controllers/home/services.js";

// only signed-in users may view shop/services
router.get("/shop", userAuth, shop.shop_get);
router.get("/services", userAuth, services.services_get);

export default router;
