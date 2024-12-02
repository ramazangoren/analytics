import { sqlQuery } from "../database/connectSQLServer.js";

// Borrow a book
export const borrowBook = async (req, res) => {
  const { user_id, book_id } = req.body;

  try {
    const user = await sqlQuery("SELECT * FROM [Analytics].[dbo].[Users] WHERE user_id = @user_id", { user_id });
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const borrowedBook = await sqlQuery(
      "SELECT * FROM [Analytics].[dbo].[BorrowedBooks] WHERE book_id = @book_id AND returned_at IS NULL",
      { book_id }
    );
    if (borrowedBook.length > 0) {
      return res.status(400).json({ message: "This book is already borrowed" });
    }

    await sqlQuery(
      "INSERT INTO [Analytics].[dbo].[BorrowedBooks] (user_id, book_id) VALUES (@user_id, @book_id)",
      { user_id, book_id }
    );
    res.status(201).json({ message: "Book borrowed successfully" });
  } catch (error) {
    console.error("Error in borrowBook:", error.message);
    res.status(500).json({ message: "Error borrowing book", error: error.message });
  }
};

// Return a book
export const returnBook = async (req, res) => {
  const { user_id, book_id, rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 0 and 5" });
  }

  try {
    const borrowedBook = await sqlQuery(
      "SELECT * FROM [Analytics].[dbo].[BorrowedBooks] WHERE user_id = @user_id AND book_id = @book_id AND returned_at IS NULL",
      { user_id, book_id }
    );
    if (borrowedBook.length === 0) {
      return res.status(404).json({ message: "Book not currently borrowed" });
    }

    await sqlQuery(
      "UPDATE [Analytics].[dbo].[BorrowedBooks] SET returned_at = GETDATE(), user_rating = @rating WHERE borrowed_id = @borrowed_id",
      { borrowed_id: borrowedBook[0].borrowed_id, rating }
    );

    const avgRating = await sqlQuery(
      "SELECT AVG(user_rating) AS avg_rating FROM [Analytics].[dbo].[BorrowedBooks] WHERE book_id = @book_id AND user_rating IS NOT NULL",
      { book_id }
    );
    const averageRating = avgRating[0]?.avg_rating || 0;

    await sqlQuery(
      "UPDATE [Analytics].[dbo].[Books] SET average_rating = @averageRating WHERE book_id = @book_id",
      { book_id, averageRating }
    );

    res.status(200).json({ message: "Book returned and rating updated" });
  } catch (error) {
    console.error("Error in returnBook:", error.message);
    res.status(500).json({ message: "Error returning book", error: error.message });
  }
};
