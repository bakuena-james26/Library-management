
function Transactions({ transactions, canManageBooks }) {
  return (
    <div className="book-section">
      <h1>Transaction History</h1>

      {!canManageBooks ? (
        <p>
          Only Admins and Librarians can view transactions.
        </p>
      ) : transactions.length === 0 ? (
        <p>No transactions have been recorded yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Book</th>
                <th>ISBN</th>
                <th>Action</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.bookTitle}</td>
                  <td>{transaction.isbn}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Transactions
