// client/src/pages/BudgetPage.jsx
import React, { useEffect, useState } from "react";
import { getCurrentBudget, setBudget } from "../services/budgetService";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";

export default function BudgetPage() {
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(0);
  const [spent, setSpent] = useState(0);
  const [changesCount, setChangesCount] = useState(0);
  const [message, setMessage] = useState("");
  const [overLimit, setOverLimit] = useState(false);
  const [eightyReached, setEightyReached] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCurrentBudget();
      setLimit(data.limitAmount || 0);
      setSpent(data.spent || 0);
      setChangesCount(data.changesCount || 0);
      setOverLimit(Boolean(data.overLimit));
      setEightyReached(Boolean(data.eightyReached));
    } catch (e) {
      setMessage("Failed to load budget");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await setBudget(Number(limit));
      setMessage("Budget updated!");
      setChangesCount(res.changesCount);
      await load();
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to update budget";
      setMessage(msg);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Monthly Budget</h1>

      <ProgressBar spent={spent} limit={limit} />

      {eightyReached && !overLimit && (
        <div className="p-3 rounded bg-yellow-900/40 border border-yellow-700 text-yellow-200">
          Alert: You have used 80% of your monthly budget.
        </div>
      )}
      {overLimit && (
        <div className="p-3 rounded bg-red-900/40 border border-red-700 text-red-200">
          Over Limit: You have spent more than your monthly budget.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-3">
        <label className="block text-sm text-gray-300">Set / Change Monthly Limit (once per month)</label>
        <input
          type="number"
          min="0"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded p-2"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-primary text-black font-semibold hover:opacity-90"
        >
          Save
        </button>
      </form>

      <div className="text-sm text-gray-400">
        Changes used this month: <b>{changesCount}/1</b>
      </div>

      {message && <div className="text-sm text-gray-300">{message}</div>}

      <div>
        <button
          onClick={() => navigate("/extra")}
          className="mt-4 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
        >
          View Extra Spending
        </button>
      </div>
    </div>
  );
}
