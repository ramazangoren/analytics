import { sqlQuery } from "../database/connectSQLServer.js";
import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
});

// List all users
export const listUsers = async (req, res) => {
  try {
    const users = await sqlQuery("SELECT * FROM [Analytics].[dbo].[Users]");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in listUsers:", error.message);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Get user details, including borrowed books and scores
export const getUserDetails = async (req, res) => {
  const { id:user_id } = req.params;
  try {
    const user = await sqlQuery("SELECT * FROM [Analytics].[dbo].[Users] WHERE user_id = @user_id", { user_id });
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const pastBorrowedBooks = await sqlQuery(`
      SELECT b.title, bb.user_rating
      FROM [Analytics].[dbo].[BorrowedBooks] bb
      JOIN [Analytics].[dbo].[Books] b ON bb.book_id = b.book_id
      WHERE bb.user_id = @user_id AND bb.returned_at IS NOT NULL
    `, { user_id });

    const currentBorrowedBooks = await sqlQuery(`
      SELECT b.title, bb.borrowed_at
      FROM [Analytics].[dbo].[BorrowedBooks] bb
      JOIN [Analytics].[dbo].[Books] b ON bb.book_id = b.book_id
      WHERE bb.user_id = @user_id AND bb.returned_at IS NULL
    `, { user_id });

    res.status(200).json({ user: user[0], pastBorrowedBooks, currentBorrowedBooks });
  } catch (error) {
    console.error("Error in getUserDetails:", error.message);
    res.status(500).json({ message: "Error fetching user details", error: error.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  const { name } = req.body;
  const { error } = userSchema.validate({ name });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newUser = await sqlQuery(
      "INSERT INTO [Analytics].[dbo].[Users] (name) OUTPUT INSERTED.* VALUES (@name)",
      { name }
    );
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error in createUser:", error.message);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};
