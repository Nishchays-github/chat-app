import express from "express";
const router = express.Router();
import {removeonlineusers,getusers} from '../controllers/onlineusers.controller.js'
import {signup, login, logout, updateProfile, checkAuth} from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js";

router.post("/signup",signup);

router.post("/login",login);


router.post("/logout",logout);
router.put("/remove-online-user",protectRoute,removeonlineusers);
router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);
router.get('/users',protectRoute,getusers)
export default router;