import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A020F0",
  "#DC143C",
];

export const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/expenses", {
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

  if (loading) {
    return <p className="text-center mt-10">Loading Reports...</p>;
  }

  // ✅ Current month filter
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(
    (exp) => new Date(exp.date).getMonth() === currentMonth
  );

  // ✅ Category-wise data (for Pie chart)
  const categoryData = currentMonthExpenses.reduce((acc, exp) => {
    const found = acc.find((item) => item.category === exp.category);
    if (found) {
      found.amount += exp.amount;
    } else {
      acc.push({ category: exp.category, amount: exp.amount });
    }
    return acc;
  }, []);

  // ✅ Monthly data for full 12 months of current year
  const currentYear = new Date().getFullYear();
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // Initialize array with 0 for each month
  const monthlyData = months.map((month, index) => ({
    month,
    amount: 0,
  }));

  // Fill actual data
  expenses.forEach((exp) => {
    const date = new Date(exp.date);
    if (date.getFullYear() === currentYear) {
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].amount += exp.amount;
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Expense Reports</h1>

      {/* ✅ Category-wise Pie Chart */}
      <h2 className="text-xl font-semibold mb-4 text-center">
        Category-wise Expenses (Current Month)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {categoryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* ✅ Monthly Trend Bar Chart (12 months of current year) */}
      <h2 className="text-xl font-semibold mb-4 text-center mt-10">
        Monthly Expense Trend ({currentYear})
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Reports;
