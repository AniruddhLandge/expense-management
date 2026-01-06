import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { buildWhatsAppShareUrl } from "../services/shareService";
// import ExtraSpending from "../pages/ExtraSpending.jsx";
import { getCurrentBudget } from "../services/budgetService";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLimit, setNewLimit] = useState("");
  const [message, setMessage] = useState("");
   const [budget, setBudget] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const fetchExpenses = async () => {
      try {
        // const res = await axios.get("http://localhost:5000/api/expenses", {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
    // fetchBudget();
  }, [token, navigate]);
  //   const fetchBudget = async () => {
  //   try {
  //     const res = await getCurrentBudget();
  //     console.log("Budget Data:", res);
  //     setBudget(res);
  //   } catch (err) {
  //     console.error("Failed to fetch budget:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ✅ Update Monthly Limit
  const updateLimit = async () => {
    try {
      const res = await axios.put(
        // "http://localhost:5000/api/user/update-limit",
        `${process.env.REACT_APP_API_URL}/api/user/update-limit`,
        { monthlyLimit: newLimit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setUser(res.data.user);

      
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setNewLimit("");
    } catch (err) {
      setMessage(
        err.response?.data?.error || "Failed to update monthly limit"
      );
    }
  };
useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentBudget();
        setBudget(res);
      } catch (err) {
        console.error("API Error:", err);
      }
    })();
  }, []);

  // if (!budget) return <div className="p-6">Loading...</div>;
  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }
  //   if (!budget) {
  //   return <div className="p-6 text-red-400">Failed to load budget data.</div>;
  // }

  const currentMonth = new Date().getMonth();
  const totalSpent = expenses
    .filter((exp) => new Date(exp.date).getMonth() === currentMonth)
    .reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* <ExtraSpending /> */}
       {budget && (
          <div className={budget.extra > 0 ? "text-red-500 font-bold" : "text-green-500 font-bold text-lg"}>
            Extra Spending: ₹{Number(budget.extra || 0).toLocaleString()}
          </div>
        )}
      </div>

      {user && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>

          
          <p className="text-center text-2xl font-bold text-primary mt-4 p-3 rounded-lg shadow-md">
            Monthly Limit: ₹{user.monthlyLimit || 0}
          </p>

         
          <div className="flex justify-center items-center gap-2 mt-4">
            <input
              type="text"
              placeholder="Enter new limit"
              className="border px-3 py-2 rounded-lg text-primary bg-gray-800"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={updateLimit}
            >
              Update Limit
            </button>
          </div>
          {message && <p className="text-center text-red-500">{message}</p>}
        </div>
      )}

      {/* ✅ Progress Bar */}
      {user && user.monthlyLimit > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Monthly Expense Progress
          </h2>

          {(() => {
            let progressPercent =
              user.monthlyLimit > 0
                ? Math.min((totalSpent / user.monthlyLimit) * 100, 100)
                : 0;

            let progressColor = "bg-green-500";
            if (progressPercent > 80) {
              progressColor = "bg-red-500";
            } else if (progressPercent > 50) {
              progressColor = "bg-orange-500";
            }

            return (
              <>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className={`h-6 rounded-full ${progressColor}`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2 text-lg font-bold text-primary">
                  Spent ₹{totalSpent} / ₹{user.monthlyLimit}
                </p>
              </>
            );
          })()}
        </div>
      )}

      {/* ✅ Expense Table */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses found!</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-primary">
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Share</th>
              </tr>
            </thead>
            <tbody>
              {expenses
                .filter((exp) => {
                  const expDate = new Date(exp.date);
                  const now = new Date();
                  return (
                    expDate.getMonth() === now.getMonth() &&
                    expDate.getFullYear() === now.getFullYear()
                  );
                })
                .slice(-10)
                .map((exp) => (
                  <tr key={exp._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {exp.title}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ₹{exp.amount}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {exp.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {exp.date}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <a
                        href={buildWhatsAppShareUrl(exp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Share
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;



