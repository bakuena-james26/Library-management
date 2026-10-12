
import { Link } from 'react-router-dom'
import './App.css'

function Login({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  message
}) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">📚</div>

        <h1>Library Management System</h1>
        <p>Sign in to access your library dashboard.</p>

        {message && (
          <p className="login-message">{message}</p>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="loginEmail">Email Address</label>
          <input
            id="loginEmail"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="username"
            required
          />

          <label htmlFor="loginPassword">Password</label>
          <input
            id="loginPassword"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button type="submit">Log In</button>
        </form>

        <p className="login-footer">Community Library</p>

        <p>
          Need to create the first account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
