
function Users({
  users,
  isAdmin,
  editUser,
  deleteUser
}) {
  return (
    <div className="book-section">
      <h1>User Management</h1>

      {!isAdmin ? (
        <p>Only an Admin can manage registered users.</p>
      ) : users.length === 0 ? (
        <p>No registered users yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Membership ID</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email || 'Not registered'}</td>
                  <td>{user.membershipId}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => editUser(user)}>
                      Update
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Users
