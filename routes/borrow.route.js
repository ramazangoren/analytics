import express from "express";
import { borrowBook, returnBook } from "../controllers/borrow.controller.js";

const router = express.Router();

router.post("/borrow", borrowBook);
router.post("/return", returnBook);

export default router;
