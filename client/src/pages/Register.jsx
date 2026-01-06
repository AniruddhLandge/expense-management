import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔔 Later change this URL → http://localhost:5000/api/auth/register
      // const res = await axios.post('http://localhost:5000/api/auth/register', {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        monthlyLimit: limit,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError('Registration error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-[350px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">Register</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 mb-3 rounded bg-gray-700 text-gray-200"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-3 rounded bg-gray-700 text-gray-200"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-3 rounded bg-gray-700 text-gray-200"
            required
          />
          <input
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Monthly Limit (₹)"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-200"
          />
          <button
            type="submit"
            className="w-full bg-primary text-black py-2 rounded font-semibold"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          <span className="text-gray-400">Already have an account?</span>{' '}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => navigate('/')} 
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
