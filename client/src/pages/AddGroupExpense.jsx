import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AddGroupExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // ✅ Step 1: Store in database
    await axios.post(
      `http://localhost:5000/api/groups/${groupId}/expenses`,
      { title, amount, category },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Step 2: Prepare UPI Intent
    const gpayDeepLink =
      "intent://pay/#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end";

    const phonePeLink = "phonepe://";

    const gpayInstall =
      "https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user";
    const phonePeInstall =
      "https://play.google.com/store/apps/details?id=com.phonepe.app";

    // Try Google Pay
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = gpayDeepLink;
    document.body.appendChild(iframe);

    setTimeout(() => {
      const iframe2 = document.createElement("iframe");
      iframe2.style.display = "none";
      iframe2.src = phonePeLink;
      document.body.appendChild(iframe2);

      setTimeout(() => {
        window.location.href = gpayInstall;
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-[370px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Add Group Expense
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-700 text-gray-200"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-700 text-gray-200"
            required
          />

          <input
            type="text"
            placeholder="Category (Food, Travel, etc.)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-700 text-gray-200"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-black py-2 rounded font-semibold"
          >
            Add Expense & Pay
          </button>
        </form>
      </div>
    </div>
  );
}
