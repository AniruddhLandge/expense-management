// // client/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // apne backend ka base URL daalo
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// // ✅ Har request ke sath token add karega
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // token yaha se read hoga

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
