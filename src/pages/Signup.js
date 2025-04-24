import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    rollNumber: "",
    semester: "",
    department: "",
    degree: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send data to backend
    console.log(form);
    navigate("/profile");
  };

  return (
    <div className="form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Roll Number:</label>
          <input type="text" name="rollNumber" value={form.rollNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <input type="text" name="semester" value={form.semester} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <input type="text" name="department" value={form.department} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Degree Program:</label>
          <input type="text" name="degree" value={form.degree} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup; 