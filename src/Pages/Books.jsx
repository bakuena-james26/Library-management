
function Books({
  books,
  canManageBooks,
  isAdmin,
  editBook,
  deleteBook,
  addStock,
  borrowBook,
  returnBook
}) {
  return (
    <div className="book-section">
      <h1>Book Management</h1>

      {!canManageBooks && (
        <p>Log in as an Admin or Librarian to manage books.</p>
      )}

      <h3>Available Books</h3>

      {books.length === 0 ? (
        <p>No books have been added yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Available</th>
                <th>Borrowed</th>
                <th>Status</th>
                {canManageBooks && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre || '—'}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>{book.borrowed || 0}</td>
                  <td>
                    {book.quantity < 2 ? 'Low Stock' : 'In Stock'}
                  </td>

                  {canManageBooks && (
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => editBook(book)}>
                          Edit
                        </button>

                        <button onClick={() => addStock(book)}>
                          Add Stock
                        </button>

                        <button onClick={() => borrowBook(book)}>
                          Borrow
                        </button>

                        <button onClick={() => returnBook(book)}>
                          Return
                        </button>

                        {isAdmin && (
                          <button
                            className="delete-button"
                            onClick={() => deleteBook(book.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Books
