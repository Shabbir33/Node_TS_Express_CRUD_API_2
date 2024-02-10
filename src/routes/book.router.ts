import express from "express";
import controller from "../controllers/book.controller";

const router = express.Router();

router.post("/create", controller.createBook);
router.get("/get/:bookId", controller.readBook);
router.get("/get/", controller.readAllBook);
router.patch("/update/:bookId", controller.updateBook);
router.delete("/delete/:bookId", controller.deleteBook);

export default router;
