import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { buildWhatsAppShareUrl } from "../utils/share";

export default function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(""); 
  const [error, setError] = useState("");
  const [showShare, setShowShare] = useState(null); // 👈 new state
  const navigate = useNavigate();

  // helper function to build whatsapp share url
  // const buildWhatsAppShareUrl = ({ amount, merchant, time }) => {
  //   const message = `✅ I just added an expense!\n\nMerchant: ${merchant}\nAmount: ₹${amount}\nTime: ${time}`;
  //   return `https://wa.me/?text=${encodeURIComponent(message)}`;
  // };

  const redirectToPaymentApp = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login again.");
        return;
      }

      const res = await axios.post(
        // "http://localhost:5000/api/expenses",
        `${process.env.REACT_APP_API_URL}/api/expenses`,
        { title, amount, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        
        setShowShare({
          amount,
          merchant: title,
          time: new Date().toLocaleTimeString(),
        });

       
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");
        redirectToPaymentApp();
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add expense. Try again!";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-[370px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Add Expense
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

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
          {/* <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-200"
          /> */}

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
