import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Book from "../models/Book";
import Logging from "../library/Logging";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const book = new Book({
      _id: new mongoose.Types.ObjectId(),
      name,
    });
    const savedBook = await book.save();

    return res.status(200).json({ Book: savedBook });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const readBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId).populate("author").select("-__v");
    if (!book) {
      return res.status(404).json({ message: "Not Found." });
    }
    return res.status(200).json({ book });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const readAllBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find().populate("author").select("-__v");
    if (!books) {
      return res.status(404).json({ message: "No Records." });
    }
    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Not Found." });
    }

    book.set(req.body);
    const savedBook = await book.save();

    return res.status(200).json({ book: savedBook });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: "Not Found." });
    }

    return res.status(200).json({ message: "Record(Book) Deleted." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default {
  createBook,
  readBook,
  readAllBook,
  updateBook,
  deleteBook,
};
