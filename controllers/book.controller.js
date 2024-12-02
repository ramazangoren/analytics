import { sqlQuery } from "../database/connectSQLServer.js";
import Joi from "joi";

const bookSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
});

// List all books
export const listBooks = async (req, res) => {
  try {
    const books = await sqlQuery("SELECT * FROM [Analytics].[dbo].[Books]");
    res.status(200).json(books);
  } catch (error) {
    console.error("Error in listBooks:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
};

// Get book details, including average rating
export const getBookDetails = async (req, res) => {
  const { id: book_id } = req.params;
  console.log(book_id);

  try {
    const book = await sqlQuery(
      "SELECT title, average_rating FROM [Analytics].[dbo].[Books] WHERE book_id = @book_id",
      { book_id }
    );

    if (book.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book[0]);
  } catch (error) {
    console.error("Error in getBookDetails:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching book details", error: error.message });
  }
};

// Create a new book
export const createBook = async (req, res) => {
  const { title } = req.body;

  const { error } = bookSchema.validate({ title });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newBook = await sqlQuery(
      "INSERT INTO [Analytics].[dbo].[Books] (title) OUTPUT INSERTED.* VALUES (@title)",
      { title }
    );
    res.status(201).json(newBook[0]);
  } catch (error) {
    console.error("Error in createBook:", error.message);
    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
};
