
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
  useNavigate
} from 'react-router-dom'
import './App.css'

import Login from './Login'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Transactions from './pages/Transactions'
import Users from './pages/Users'

function loadData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function AppContent() {
  const navigate = useNavigate()

  const [books, setBooks] = useState(() => loadData('libraryBooks'))
  const [transactions, setTransactions] = useState(() =>
    loadData('libraryTransactions')
  )
  const [users, setUsers] = useState(() => loadData('libraryUsers'))

  const [loggedInUser, setLoggedInUser] = useState(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [quantity, setQuantity] = useState('')
  const [editId, setEditId] = useState(null)

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [userRole, setUserRole] = useState('Member')
  const [editingUserId, setEditingUserId] = useState(null)

  const isAdmin = loggedInUser?.role === 'Admin'
  const isLibrarian = loggedInUser?.role === 'Librarian'
  const canManageBooks = isAdmin || isLibrarian
  const canManageUsers = isAdmin

  const hasAdminAccount = users.some(
    (user) => user.role === 'Admin' && user.email
  )

  useEffect(() => {
    localStorage.setItem('libraryBooks', JSON.stringify(books))
  }, [books])

  useEffect(() => {
    localStorage.setItem(
      'libraryTransactions',
      JSON.stringify(transactions)
    )
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('libraryUsers', JSON.stringify(users))
  }, [users])

  function clearBookForm() {
    setTitle('')
    setAuthor('')
    setGenre('')
    setIsbn('')
    setQuantity('')
    setEditId(null)
  }

  function clearUserForm() {
    setUserName('')
    setUserEmail('')
    setUserPassword('')
    setMembershipId('')
    setUserRole('Member')
    setEditingUserId(null)
  }

  function recordTransaction(book, type, amount) {
    setTransactions((previous) => [
      {
        id: Date.now() + Math.random(),
        bookTitle: book.title,
        isbn: book.isbn,
        type,
        quantity: amount,
        date: new Date().toLocaleString()
      },
      ...previous
    ])
  }

  function handleLogin(e) {
    e.preventDefault()

    const email = loginEmail.trim().toLowerCase()
    const user = users.find(
      (item) =>
        item.email?.toLowerCase() === email &&
        item.password === loginPassword
    )

    if (!user) {
      setLoginMessage('Incorrect email or password.')
      return
    }

    setLoggedInUser(user)
    setLoginEmail('')
    setLoginPassword('')
    setLoginMessage('')
    navigate('/dashboard')
  }

  function handleLogout() {
    setLoggedInUser(null)
    clearBookForm()
    clearUserForm()
    navigate('/login')
  }

  function handleRegister(e) {
    e.preventDefault()

    const name = userName.trim()
    const email = userEmail.trim().toLowerCase()
    const memberId = membershipId.trim()

    if (!name || !email || !memberId) {
      alert('Please complete all fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Enter a valid email address.')
      return
    }

    if (userPassword.length < 8) {
      alert('Password must contain at least 8 characters.')
      return
    }

    const duplicate = users.some(
      (user) =>
        user.email?.toLowerCase() === email ||
        user.membershipId?.toLowerCase() === memberId.toLowerCase()
    )

    if (duplicate) {
      alert('That email or membership ID is already registered.')
      return
    }

    if (hasAdminAccount && !isAdmin) {
      alert('Only an Admin can register additional users.')
      return
    }

    const role = hasAdminAccount ? userRole : 'Admin'

    const newUser = {
      id: Date.now(),
      name,
      email,
      membershipId: memberId,
      password: userPassword,
      role
    }

    setUsers((previous) => [...previous, newUser])
    clearUserForm()
    alert(`Registration successful. Role: ${role}`)

    if (!hasAdminAccount) {
      navigate('/login')
    } else {
      navigate('/users')
    }
  }

  function handleBookSubmit(e) {
    e.preventDefault()

    if (!canManageBooks) {
      alert('Only Admins and Librarians can manage books.')
      return
    }

    if (
      !title.trim() ||
      !author.trim() ||
      !genre.trim() ||
      !isbn.trim() ||
      quantity === '' ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      alert('Enter valid information in all book fields.')
      return
    }

    const cleanIsbn = isbn.trim()
    const duplicate = books.some(
      (book) => book.isbn === cleanIsbn && book.id !== editId
    )

    if (duplicate) {
      alert('A book with this ISBN already exists.')
      return
    }

    const details = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      isbn: cleanIsbn,
      quantity: Number(quantity)
    }

    if (editId !== null) {
      const oldBook = books.find((book) => book.id === editId)
      if (!oldBook) return

      if (details.quantity < (oldBook.borrowed || 0)) {
        alert('Quantity cannot be less than borrowed copies.')
        return
      }

      setBooks((previous) =>
        previous.map((book) =>
          book.id === editId ? { ...book, ...details } : book
        )
      )
    } else {
      setBooks((previous) => [
        ...previous,
        { id: Date.now(), ...details, borrowed: 0 }
      ])
    }

    clearBookForm()
  }

  function editBook(book) {
    if (!canManageBooks) return

    setTitle(book.title)
    setAuthor(book.author)
    setGenre(book.genre)
    setIsbn(book.isbn)
    setQuantity(String(book.quantity))
    setEditId(book.id)
    navigate('/books')
  }

  function deleteBook(id) {
    if (!canManageBooks) return

    const book = books.find((item) => item.id === id)
    if (!book) return

    if ((book.borrowed || 0) > 0) {
      alert('Return all borrowed copies before deleting this book.')
      return
    }

    if (window.confirm('Delete this book?')) {
      setBooks((previous) => previous.filter((item) => item.id !== id))
      if (editId === id) clearBookForm()
    }
  }

  function addStock(book) {
    if (!canManageBooks) return

    const answer = window.prompt(
      `How many copies of "${book.title}" arrived?`
    )
    if (answer === null) return

    const amount = Number(answer)
    if (!Number.isSafeInteger(amount) || amount < 1) {
      alert('Enter a whole number greater than zero.')
      return
    }

    setBooks((previous) =>
      previous.map((item) =>
        item.id === book.id
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
    )

    recordTransaction(book, 'Stock Added', amount)
  }

  function borrowBook(book) {
    if (!canManageBooks) return

    if (book.quantity < 1) {
      alert('No copies are available.')
      return
    }

    setBooks((previous) =>
      previous.map((item) =>
        item.id === book.id
          ? {
              ...item,
              quantity: item.quantity - 1,
              borrowed: (item.borrowed || 0) + 1
            }
          : item
      )
    )

    recordTransaction(book, 'Borrowed', 1)
  }

  function returnBook(book) {
    if (!canManageBooks) return

    if ((book.borrowed || 0) < 1) {
      alert('There are no borrowed copies to return.')
      return
    }

    setBooks((previous) =>
      previous.map((item) =>
        item.id === book.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              borrowed: item.borrowed - 1
            }
          : item
      )
    )

    recordTransaction(book, 'Returned', 1)
  }

  function editUser(user) {
    if (!isAdmin) return

    setUserName(user.name)
    setUserEmail(user.email || '')
    setUserPassword('')
    setMembershipId(user.membershipId)
    setUserRole(user.role)
    setEditingUserId(user.id)
    navigate('/users')
  }

  function saveUserEdit(e) {
    e.preventDefault()

    if (!isAdmin || editingUserId === null) return

    const name = userName.trim()
    const email = userEmail.trim().toLowerCase()
    const memberId = membershipId.trim()

    if (!name || !email || !memberId) {
      alert('Please complete all user fields.')
      return
    }

    const duplicate = users.some(
      (user) =>
        user.id !== editingUserId &&
        (
          user.email?.toLowerCase() === email ||
          user.membershipId?.toLowerCase() === memberId.toLowerCase()
        )
    )

    if (duplicate) {
      alert('That email or membership ID is already registered.')
      return
    }

    const existing = users.find((user) => user.id === editingUserId)
    if (!existing) return

    const updated = {
      ...existing,
      name,
      email,
      membershipId: memberId,
      role: userRole,
      password: userPassword || existing.password
    }

    setUsers((previous) =>
      previous.map((user) =>
        user.id === editingUserId ? updated : user
      )
    )

    if (loggedInUser?.id === editingUserId) {
      setLoggedInUser(updated)
    }

    clearUserForm()
    alert('User updated successfully.')
  }

  function deleteUser(id) {
    if (!isAdmin) return

    if (id === loggedInUser?.id) {
      alert('You cannot delete your own account while logged in.')
      return
    }

    if (window.confirm('Delete this user?')) {
      setUsers((previous) => previous.filter((user) => user.id !== id))
      if (editingUserId === id) clearUserForm()
    }
  }

  const totalCopies = books.reduce(
    (total, book) => total + Number(book.quantity || 0),
    0
  )

  function ProtectedLayout() {
    if (!loggedInUser) return <Navigate to="/login" replace />

    return (
      <div className="app">
        <nav className="navbar">
          <h2>📚 Library System</h2>

          <div className="nav-links">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/books">Books</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            {isAdmin && <NavLink to="/users">Users</NavLink>}
            <button type="button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </nav>

        <main className="container">
          <p>
            Welcome, <strong>{loggedInUser.name}</strong> —{' '}
            {loggedInUser.role}
          </p>

          <Routes>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  books={books}
                  transactions={transactions}
                  users={users}
                />
              }
            />

            <Route
              path="/books"
              element={
                <>
                  <section className="book-section">
                    <h2>{editId !== null ? 'Update Book' : 'Add a Book'}</h2>

                    {canManageBooks && (
                      <form onSubmit={handleBookSubmit}>
                        <label htmlFor="title">Book Title</label>
                        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

                        <label htmlFor="author">Author</label>
                        <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />

                        <label htmlFor="genre">Genre</label>
                        <input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} required />

                        <label htmlFor="isbn">ISBN</label>
                        <input id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />

                        <label htmlFor="quantity">Initial Quantity</label>
                        <input
                          id="quantity"
                          type="number"
                          min="0"
                          step="1"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          required
                        />

                        <button type="submit">
                          {editId !== null ? 'Update Book' : 'Add Book'}
                        </button>

                        {editId !== null && (
                          <button type="button" onClick={clearBookForm}>
                            Cancel
                          </button>
                        )}
                      </form>
                    )}
                  </section>

                  <Books
                    books={books}
                    canManageBooks={canManageBooks}
                    isAdmin={isAdmin}
                    editBook={editBook}
                    deleteBook={deleteBook}
                    addStock={addStock}
                    borrowBook={borrowBook}
                    returnBook={returnBook}
                  />
                </>
              }
            />

            <Route
              path="/transactions"
              element={
                <Transactions
                  transactions={transactions}
                  canManageBooks={canManageBooks}
                />
              }
            />

            <Route
              path="/users"
              element={
                isAdmin ? (
                  <>
                    <section className="book-section">
                      <h2>{editingUserId !== null ? 'Update User' : 'Register User'}</h2>

                      <form onSubmit={editingUserId !== null ? saveUserEdit : handleRegister}>
                        <label htmlFor="userName">Full Name</label>
                        <input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} required />

                        <label htmlFor="userEmail">Email Address</label>
                        <input id="userEmail" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />

                        <label htmlFor="membershipId">Membership ID</label>
                        <input id="membershipId" value={membershipId} onChange={(e) => setMembershipId(e.target.value)} required />

                        <label htmlFor="userPassword">Password (leave blank to keep current password when editing)</label>
                        <input
                          id="userPassword"
                          type="password"
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          minLength={editingUserId === null ? 8 : undefined}
                          required={editingUserId === null}
                        />

                        <label htmlFor="userRole">Account Role</label>
                        <select id="userRole" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                          <option value="Member">Member</option>
                          <option value="Librarian">Librarian</option>
                          <option value="Admin">Admin</option>
                        </select>

                        <button type="submit">
                          {editingUserId !== null ? 'Update User' : 'Register User'}
                        </button>

                        {editingUserId !== null && (
                          <button type="button" onClick={clearUserForm}>
                            Cancel
                          </button>
                        )}
                      </form>
                    </section>

                    <Users
                      users={users}
                      isAdmin={isAdmin}
                      editUser={editUser}
                      deleteUser={deleteUser}
                    />
                  </>
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <footer>
            <p>Library Management System | Community Library</p>
          </footer>
        </main>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          loggedInUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login
              loginEmail={loginEmail}
              setLoginEmail={setLoginEmail}
              loginPassword={loginPassword}
              setLoginPassword={setLoginPassword}
              handleLogin={handleLogin}
              message={loginMessage}
            />
          )
        }
      />

      <Route
        path="/register"
        element={
          !hasAdminAccount ? (
            <main className="container book-section">
              <h1>Create the First Admin Account</h1>
              <p>The first registered account becomes the Admin.</p>

              <form onSubmit={handleRegister}>
                <label htmlFor="userName">Full Name</label>
                <input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} required />

                <label htmlFor="userEmail">Email Address</label>
                <input id="userEmail" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />

                <label htmlFor="membershipId">Membership ID</label>
                <input id="membershipId" value={membershipId} onChange={(e) => setMembershipId(e.target.value)} required />

                <label htmlFor="userPassword">Password (at least 8 characters)</label>
                <input id="userPassword" type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} minLength={8} required />

                <button type="submit">Create Admin Account</button>
              </form>

              <p><Link to="/login">Back to login</Link></p>
            </main>
          ) : (
            <Navigate to={isAdmin ? '/users' : '/login'} replace />
          )
        }
      />

      <Route
        path="/*"
        element={<ProtectedLayout />}
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
