// ==== FRONTEND (React with Hooks) ====
// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { FaBuilding, FaUserTie, FaClipboardCheck, FaCalendarAlt, FaLink } from 'react-icons/fa';

const API = process.env.REACT_APP_API;

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    date: '',
    link: ''
  });
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    axios.get(`${API}/jobs`).then(res => setJobs(res.data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addJob = e => {
    e.preventDefault();
    axios.post(`${API}/jobs`, form).then(res => {
      setJobs([...jobs, res.data]);
      alert('✅ Job added successfully!');
    });
  };

  const updateStatus = (id, status) => {
    axios.patch(`${API}/jobs/${id}`, { status }).then(res => {
      setJobs(jobs.map(job => job._id === id ? res.data : job));
      setEditingId(null);
      alert('✏️ Job status updated!');
    });
  };

  const deleteJob = id => {
    axios.delete(`${API}/jobs/${id}`).then(() => {
      setJobs(jobs.filter(job => job._id !== id));
      alert('🗑️ Job deleted!');
    });
  };

  const filteredJobs = filter === 'All' ? jobs : jobs.filter(job => job.status === filter);

  return (
    <div className="app-container">
      <h1 className="title">Student Job Tracker</h1>
      <form onSubmit={addJob} className="form">
        <div className="input-row"><FaBuilding className="icon" /><input name="company" onChange={handleChange} placeholder="Company" className="input" /></div>
        <div className="input-row"><FaUserTie className="icon" /><input name="role" onChange={handleChange} placeholder="Role" className="input" /></div>
        <div className="input-row"><FaClipboardCheck className="icon" /><select name="status" onChange={handleChange} className="input">
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select></div>
        <div className="input-row"><FaCalendarAlt className="icon" /><input name="date" type="date" onChange={handleChange} className="input" /></div>
        <div className="input-row"><FaLink className="icon" /><input name="link" onChange={handleChange} placeholder="Link" className="input" /></div>
        <button type="submit" className="submit-button">Add Job</button>
      </form>

      <div className="filter">
        <select onChange={e => setFilter(e.target.value)} className="input">
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="job-list">
        {filteredJobs.map(job => (
          <div key={job._id} className="job-card">
            <h2 className="job-title">{job.company} - {job.role}</h2>
            <p><span className="label">Status:</span> {job.status}</p>
            <p><span className="label">Date:</span> {job.date}</p>
            <a href={job.link} target="_blank" rel="noopener noreferrer" className="job-link">{job.link}</a>

            <div className="action-buttons">
              <button 
                onClick={() => {
                  setEditingId(job._id);
                  setEditStatus(job.status);
                }}
                className="update-button"
              >
                Update
              </button>
              <button 
                onClick={() => deleteJob(job._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>

            {editingId === job._id && (
              <div className="edit-status">
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="input"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
                <button
                  onClick={() => updateStatus(job._id, editStatus)}
                  className="save-button"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
