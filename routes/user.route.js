import express from "express";
import { listUsers, createUser,getUserDetails } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/listUsers", listUsers);
router.post("/createUser", createUser);
router.get("/user/:id", getUserDetails);

export default router;
