import express from "express";
import { register, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.get("/test", (req, res) => {
	res.send("Auth Routes working!");
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
