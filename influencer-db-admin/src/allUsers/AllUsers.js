import React, { useEffect, useState } from "react";
import './AllUsers.css'

function AllUsers() {
    const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/");
      const data = await response.json();
      console.log(data)
      setUsers(data); // Assuming API returns an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  return (
    <div className="home-container"> 
    <h2 className="subtitle">Users List</h2>
    <div className="table-container">
      <table className="user-table">
          
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Company Name</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="user-row"
              >
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.companyName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-users">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Modal Popup */}
    {isModalOpen && selectedUser && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>User Details</h2>
          <p><strong>First Name:</strong> {selectedUser.firstName}</p>
          <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Company Name:</strong> {selectedUser.companyName}</p>
          <button onClick={closeModal} className="close-button">Close</button>
        </div>
      </div>
    )}
  </div>
  )
}

export default AllUsers
