
import { useMemo } from 'react'

function Dashboard({ books, transactions, users }) {
  const totalCopies = books.reduce(
    (total, book) => total + Number(book.quantity || 0),
    0
  )

  const borrowedCopies = books.reduce(
    (total, book) => total + Number(book.borrowed || 0),
    0
  )

  const lowStock = books.filter(
    (book) => Number(book.quantity || 0) < 2
  ).length

  const availableCopies = totalCopies

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions]
  )

  const stats = [
    {
      title: 'Different Books',
      value: books.length,
      icon: '▤',
      color: 'blue',
      description: 'Book titles in your library'
    },
    {
      title: 'Available Copies',
      value: availableCopies,
      icon: '▣',
      color: 'green',
      description: 'Copies ready to borrow'
    },
    {
      title: 'Borrowed Copies',
      value: borrowedCopies,
      icon: '↗',
      color: 'purple',
      description: 'Copies currently borrowed'
    },
    {
      title: 'Registered Users',
      value: users.length,
      icon: '♙',
      color: 'orange',
      description: 'Library accounts'
    }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Library Dashboard</h1>
          <p>
            Welcome back! Here is an overview of your library.
          </p>
        </div>

        <div className="dashboard-date">
          <span>Today's date</span>
          <strong>
            {new Date().toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </strong>
        </div>
      </div>

      <div className="dashboard-alerts">
        <div>
          <span className="alert-icon">!</span>
          <div>
            <strong>Low stock alert</strong>
            <p>
              {lowStock === 0
                ? 'All books have sufficient stock.'
                : `${lowStock} book title(s) have fewer than 2 available copies.`}
            </p>
          </div>
        </div>

        <span className={`stock-badge ${lowStock > 0 ? 'warning' : 'success'}`}>
          {lowStock > 0 ? `${lowStock} alerts` : 'All good'}
        </span>
      </div>

      <div className="dashboard-section-heading">
        <div>
          <h2>Library Statistics</h2>
          <p>A quick look at your library's current status.</p>
        </div>
      </div>

      <div className="cards">
        {stats.map((stat) => (
          <div className="card dashboard-card" key={stat.title}>
            <div className="stat-top">
              <span className={`stat-icon ${stat.color}`}>
                {stat.icon}
              </span>
              <span className="stat-label">{stat.title}</span>
            </div>

            <h2>{stat.value.toLocaleString()}</h2>
            <p>{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Transactions</h2>
              <p>Your latest library activity</p>
            </div>
            <span className="panel-count">
              {transactions.length} total
            </span>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">↔</span>
              <strong>No transactions yet</strong>
              <p>
                Borrowing, returning, and stock updates will appear here.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Activity</th>
                    <th>Quantity</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <strong>{transaction.bookTitle || 'Unknown book'}</strong>
                      </td>
                      <td>
                        <span className="transaction-type">
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.quantity}</td>
                      <td>{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="dashboard-panel inventory-panel">
          <div className="panel-heading">
            <div>
              <h2>Inventory Summary</h2>
              <p>Stock overview</p>
            </div>
          </div>

          <div className="inventory-row">
            <span>Total book titles</span>
            <strong>{books.length}</strong>
          </div>

          <div className="inventory-row">
            <span>Available copies</span>
            <strong>{availableCopies}</strong>
          </div>

          <div className="inventory-row">
            <span>Borrowed copies</span>
            <strong>{borrowedCopies}</strong>
          </div>

          <div className="inventory-row">
            <span>Low stock titles</span>
            <strong className={lowStock > 0 ? 'warning-text' : 'success-text'}>
              {lowStock}
            </strong>
          </div>

          <div className="inventory-progress">
            <div className="progress-label">
              <span>Stock availability</span>
              <strong>
                {totalCopies + borrowedCopies > 0
                  ? Math.round(
                      (availableCopies / (totalCopies + borrowedCopies)) * 100
                    )
                  : 0}%
              </strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    totalCopies + borrowedCopies > 0
                      ? (availableCopies / (totalCopies + borrowedCopies)) * 100
                      : 0
                  }%`
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
