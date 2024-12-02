import express from "express";
import { listBooks, createBook, getBookDetails } from "../controllers/book.controller.js";

const router = express.Router();


router.get("/listBooks", listBooks); 
router.get("/listBooks/:id", getBookDetails);
router.post("/createBook", createBook); 

export default router;
