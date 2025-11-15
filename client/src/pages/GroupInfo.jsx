import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { buildGroupShareUrl } from "../services/shareService";

export default function GroupInfo() {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/groups/${groupId}/expenses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ✅ Data Safety Checks
        setGroupName(res.data.groupName || "Group");
        setExpenses(Array.isArray(res.data.expenses) ? res.data.expenses : []);
        setTotalSpent(res.data.totalSpent || 0);

      } catch (err) {
        console.log("Error fetching expenses:", err);
      }
    };

    fetchExpenses();
  }, [groupId]);

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* ✅ Group Name */}
      <h1 className="text-3xl font-bold mb-2 text-center text-primary">
        {groupName}
      </h1>

      {/* ✅ Total Spend */}
      <p className="text-center text-green-400 text-lg font-semibold mb-5">
        Total Spent: ₹{totalSpent}
      </p>
       <button
        onClick={() => window.open(buildGroupShareUrl(groupName, expenses), "_blank")}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 w-full"
      >
        Share Entire Group Expense List
      </button>
      {/* ✅ Expenses */}
      {expenses.length === 0 ? (
        <p className="text-center text-gray-400">No expenses added yet.</p>
      ) : (
        <div className="space-y-3">
          {expenses.slice().reverse().map((exp) => (
            <div key={exp.id} className="bg-gray-800 p-4 rounded border border-gray-700">
              <p className="text-lg font-semibold text-primary">{exp.title}</p>
              <p className="text-gray-300">
                Amount: <span className="text-green-400">₹{exp.amount}</span>
              </p>
              <p className="text-gray-300">Category: {exp.category}</p>
              <p className="text-gray-500 text-sm">
                {new Date(exp.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
