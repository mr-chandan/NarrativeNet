import express from "express";
import UserController from "../controllers/User.controller.js";

const router = express.Router();
const userController = new UserController();

router.post("/setuserdata", userController.setUserData);

export default router;
