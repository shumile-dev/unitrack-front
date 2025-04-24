import React from "react";

const Profile = () => {
  // TODO: Replace with actual user data from backend
  const user = {
    email: "user@example.com",
    rollNumber: "123456",
    semester: "4",
    department: "Computer Science",
    degree: "B.Sc"
  };

  return (
    <div className="page-container">
      <h1>Profile</h1>
      <div className="profile-item">
        <label>Email:</label> {user.email}
      </div>
      <div className="profile-item">
        <label>Roll Number:</label> {user.rollNumber}
      </div>
      <div className="profile-item">
        <label>Semester:</label> {user.semester}
      </div>
      <div className="profile-item">
        <label>Department:</label> {user.department}
      </div>
      <div className="profile-item">
        <label>Degree Program:</label> {user.degree}
      </div>
    </div>
  );
};

export default Profile; 