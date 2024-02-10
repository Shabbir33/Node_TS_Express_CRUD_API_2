import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Author from "../models/Author";
import Logging from "../library/Logging";

const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const author = new Author({
      _id: new mongoose.Types.ObjectId(),
      name,
    });
    const savedAuthor = await author.save();

    return res.status(200).json({ author: savedAuthor });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const readAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.params.authorId;

    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: "Not Found." });
    }
    return res.status(200).json({ author });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const readAllAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authors = await Author.find();
    if (!authors) {
      return res.status(404).json({ message: "No Records." });
    }
    return res.status(200).json({ authors });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId;

    const author = await Author.findById(authorId);

    if (!author) {
      return res.status(404).json({ message: "Not Found." });
    }

    author.set(req.body);
    const savedAuthor = await author.save();

    return res.status(200).json({ author: savedAuthor });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId;

    const deletedAuthor = await Author.findByIdAndDelete(authorId);
    if (!deletedAuthor) {
      return res.status(404).json({ message: "Not Found." });
    }

    return res.status(200).json({ message: "Record(Author) Deleted." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default {
  createAuthor,
  readAuthor,
  readAllAuthor,
  updateAuthor,
  deleteAuthor,
};
