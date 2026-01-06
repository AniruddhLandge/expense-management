import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });


      // Save token & user info in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-[350px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-200"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-200"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded font-semibold ${
                            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary text-black'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-3">
          <span className="text-gray-400">No account?</span>{' '}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

