import React, { useEffect, useState } from "react";
import axios from "axios";
import { buildWhatsAppShareUrl } from "../services/shareService";

const History = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
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
  }, [token]);

  if (loading) return <p className="text-center mt-10">Loading history...</p>;

  // ✅ Total expense (all time)
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // ✅ WhatsApp share text
  const shareText = `Hi 👋, here is my expense summary:

Total Expenses: ₹${total}
Number of Records: ${expenses.length}

- Shared from Expense Tracker App`;

  const shareUrl = buildWhatsAppShareUrl(shareText);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expense History</h1>
        {/* <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Share on WhatsApp
        </a> */}
      </div>

      <div className="mb-4 p-4 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold">
          Total Expense (All Time): ₹{total}
        </h2>
        {/* <p>Total Records: {expenses.length}</p> */}
        {/* {user && <p>Shared by: {user.name} ({user.email})</p>} */}
      </div>

      {expenses.length === 0 ? (
        <p>No expenses found!</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Share</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td className="border border-gray-300 px-4 py-2">{exp.title}</td>
                <td className="border border-gray-300 px-4 py-2">₹{exp.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{exp.category}</td>
                <td className="border border-gray-300 px-4 py-2">{exp.date}</td>
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
  );
};

export default History;
