export const buildWhatsAppShareUrl = ({ amount, merchant, time }) => {
  const text = `💸 Expense Alert!\n\nMerchant: ${merchant}\nAmount: ₹${amount}\nTime: ${time}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};
