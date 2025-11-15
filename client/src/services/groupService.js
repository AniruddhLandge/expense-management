import api from "./api.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createGroup = (data) => 
  api.post("/groups", data, getAuthHeaders());

export const getGroups = () => 
  api.get("/groups", getAuthHeaders());

export const addGroupExpense = (groupId, data) =>
  api.post(`/groups/${groupId}/expenses`, data, getAuthHeaders());

export const getGroupExpenses = (groupId) =>
  api.get(`/groups/${groupId}/expenses`, getAuthHeaders());

export const deleteGroup = (id) => 
  api.delete(`/groups/${id}`, getAuthHeaders());  // ✅ FINAL
