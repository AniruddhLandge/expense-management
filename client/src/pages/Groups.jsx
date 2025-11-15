import React, { useEffect, useState } from "react";
import { createGroup, getGroups, deleteGroup } from "../services/groupService.js";
import { buildWhatsAppShareUrl, buildGroupShareUrl } from "../services/shareService";// ✅ WhatsApp share util

import { useNavigate } from "react-router-dom";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

    const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      setMessage("❌ Failed to fetch groups");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await createGroup({
        name: groupName,
        members: members.split(",").map((m) => m.trim()),
      });
      setGroupName("");
      setMembers("");
      setMessage("✅ Group created successfully!");
      fetchGroups();
    } catch (err) {
      console.error("Failed to create group:", err);
      setMessage("❌ Failed to create group");
    } finally {
      setLoading(false);
    }
  };

    const handleAddExpense = (groupId) => {
    navigate(`/add-expense/${groupId}`);
  };

  const handleInfo = (groupId) => {
    navigate(`/group-info/${groupId}`);
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this group?")) return;
  try {
    await deleteGroup(id);
    setGroups(groups.filter((g) => g.id !== id)); // UI update
    setMessage("🗑️ Group deleted successfully!");
  } catch (err) {
    console.error("Failed to delete group:", err);
    setMessage("❌ Failed to delete group");
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">Groups</h1>

      {/* ✅ Success / Error Message */}
      {message && <p className="mb-4 text-green-400">{message}</p>}

     

      {/* ✅ Groups Table */}
      {groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-primary">
              <th className="border border-gray-300 px-4 py-2">Group Name</th>
              <th className="border border-gray-300 px-4 py-2">Members</th>
              <th className="border border-gray-300 px-4 py-2">Total Spent</th>
              <th className="border border-gray-300 px-4 py-2">Add Expense</th>
              <th className="border border-gray-300 px-4 py-2">Info</th>
              <th className="border border-gray-300 px-4 py-2">Share</th>
              <th className="border border-gray-300 px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {groups.slice().reverse().map((group) => (
              <tr key={group.id} className="text-white">
                <td className="border border-gray-300 px-4 py-2">
                  {group.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Array.isArray(group.members)
                    ? group.members.join("  ,  ")
                    : group.members}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ₹{group.totalSpent || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleAddExpense(group.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Add Expense
                  </button>
                </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleInfo(group.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Get Info
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <a
                    href={buildWhatsAppShareUrl({
                    title: `Group: ${group.name}`,
                    amount: group.totalSpent,
                    //  createdAt: new Date()
                 })}
                      target="_blank"
                       rel="noopener noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Share
                  </a>
                </td>
                    {/* ✅ DELETE BUTTON */}
     <td className="border border-gray-300 px-4 py-2 text-center">
      <button 
  onClick={() => handleDelete(group.id)}
  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
>
  Delete
</button>
     </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Groups;


// import React, { useEffect, useState } from "react";
// import { createGroup, getGroups } from "../services/groupService.js";
// import { buildWhatsAppShareUrl } from "../utils/share.js"; // ✅ WhatsApp share util

// const Groups = () => {
//   const [groups, setGroups] = useState([]);
//   const [groupName, setGroupName] = useState("");
//   const [members, setMembers] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const fetchGroups = async () => {
//     try {
//       const res = await getGroups();
//       setGroups(res.data);
//     } catch (err) {
//       console.error("Failed to fetch groups:", err);
//       setMessage("❌ Failed to fetch groups");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     try {
//       await createGroup({
//         name: groupName,
//         members: members.split(",").map((m) => m.trim()),
//       });
//       setGroupName("");
//       setMembers("");
//       setMessage("✅ Group created successfully!");
//       fetchGroups();
//     } catch (err) {
//       console.error("Failed to create group:", err);
//       setMessage("❌ Failed to create group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4 text-primary">Groups</h1>

//       {/* ✅ Success / Error Message */}
//       {message && <p className="mb-4 text-green-400">{message}</p>}

//       {/* ✅ Create Group Form */}
//       <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
//         <input
//           type="text"
//           placeholder="Group Name"
//           value={groupName}
//           onChange={(e) => setGroupName(e.target.value)}
//           className="border px-3 py-2 rounded-lg flex-1"
//         />
//         <input
//           type="text"
//           placeholder="Members (comma separated)"
//           value={members}
//           onChange={(e) => setMembers(e.target.value)}
//           className="border px-3 py-2 rounded-lg flex-1"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//         >
//           {loading ? "Creating..." : "Create Group"}
//         </button>
//       </form>

//       {/* ✅ Groups Table */}
//       {groups.length === 0 ? (
//         <p>No groups found.</p>
//       ) : (
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-800 text-primary">
//               <th className="border border-gray-300 px-4 py-2">Group Name</th>
//               <th className="border border-gray-300 px-4 py-2">Members</th>
//               <th className="border border-gray-300 px-4 py-2">Total Spent</th>
//               <th className="border border-gray-300 px-4 py-2">Add Expense</th>
//               <th className="border border-gray-300 px-4 py-2">Info</th>
//               <th className="border border-gray-300 px-4 py-2">Share</th>
//             </tr>
//           </thead>
//           <tbody>
//             {groups.slice().reverse().map((group) => (
//               <tr key={group._id} className="text-white">
//                 <td className="border border-gray-300 px-4 py-2">
//                   {group.name}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {Array.isArray(group.members)
//                     ? group.members.join(", ")
//                     : group.members}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2 text-center">
//                   ₹{group.totalSpent || 0}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2 text-center">
//                   <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
//                     Add Expense
//                   </button>
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2 text-center">
//                   <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
//                     Get Info
//                   </button>
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2 text-center">
//                   <a
//                     href={buildWhatsAppShareUrl(group)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                   >
//                     Share
//                   </a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Groups;
