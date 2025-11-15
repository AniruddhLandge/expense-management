export const buildWhatsAppShareUrl = (expense) => {
  const { amount, title, createdAt } = expense;

  // ✅ Correct date source handling
  const dateValue = createdAt || expense.date || new Date();

  // ✅ Convert to DD-MM-YYYY
  const d = new Date(dateValue);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const text = `💰 Expense Alert!

Title: ${title}
Amount: ₹${amount}
Date: ${formattedDate}

Shared via Split Expense Tracker ✅`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export const buildGroupShareUrl = (groupName, expenses) => {
  let expenseListText = expenses
    .map(
      (e) =>
        `• ${e.title}: ₹${e.amount} (${e.category}) ${new Date(e.createdAt).toLocaleDateString()}`
    )
    .join("\n");

  const text = `📌 *Group Expense Summary* - ${groupName}

${expenseListText}

Shared via Split Expense Tracker`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};