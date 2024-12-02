CREATE TABLE [Analytics].[dbo].[Users] (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE [Analytics].[dbo].[Books] (
    book_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    average_rating FLOAT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE [Analytics].[dbo].[BorrowedBooks] (
    borrowed_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES [Analytics].[dbo].[Users](user_id),
    book_id INT NOT NULL FOREIGN KEY REFERENCES [Analytics].[dbo].[Books](book_id),
    borrowed_at DATETIME DEFAULT GETDATE(),
    returned_at DATETIME NULL,
    user_rating FLOAT CHECK (user_rating >= 0 AND user_rating <= 5),
    CONSTRAINT FK_BorrowedBooks_User FOREIGN KEY (user_id) REFERENCES [Analytics].[dbo].[Users](user_id),
    CONSTRAINT FK_BorrowedBooks_Book FOREIGN KEY (book_id) REFERENCES [Analytics].[dbo].[Books](book_id)
);

CREATE INDEX IX_Books_BookId ON [Analytics].[dbo].[Books](book_id);
CREATE INDEX IX_BorrowedBooks_Active ON [Analytics].[dbo].[BorrowedBooks](book_id, returned_at) WHERE returned_at IS NULL;
