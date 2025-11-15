import React, { useState } from "react";
import { createGroup } from "../services/groupService.js";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([""]);
  const navigate = useNavigate();

  const handleAddMember = () => setMembers([...members, ""]);

  const handleChange = (i, value) => {
    const newMembers = [...members];
    newMembers[i] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createGroup({ name, members });
    navigate("/groups"); 
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-primary">Create Group</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group Name"
          className="w-full p-2 border rounded text-primary bg-gray-800" required
        />
        {members.map((m, i) => (
          <input
            key={i}
            value={m}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder={`Member ${i + 1}`}
            className="w-full p-2 border rounded text-primary bg-gray-800" required
          />
        ))}
        <div className="space-x-4">
        <button type="button" onClick={handleAddMember} className="bg-gray-700 px-3 py-1 rounded">
          + Add Member
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
        </div>
      </form>
    </div>
  );
}
