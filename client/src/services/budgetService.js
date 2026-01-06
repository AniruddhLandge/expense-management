import axios from "axios";

// const API = "http://localhost:5000/api/budget";
const API = `${process.env.REACT_APP_API_URL}/api/budget`;
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

// ✅ Get current month budget + extra spending
export const getCurrentBudget = async () => {
  const { data } = await axios.get(`${API}/current`, auth());
  return data; // { month, monthlyLimit, totalSpent, extra }
};

// (optional) Set new budget if needed
export const setBudget = async (amount) => {
  const { data } = await axios.post(`${API}/set`, { amount }, auth());
  return data;
};

// (optional) Get old budget history
export const getBudgetHistory = async () => {
  const { data } = await axios.get(`${API}/history`, auth());
  return data;
};
