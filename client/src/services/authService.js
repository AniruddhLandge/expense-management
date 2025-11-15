// client/src/services/authService.js

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
}

// import jwtDecode from "jwt-decode";

// export function isLoggedIn() {
//   const token = localStorage.getItem("token");
//   if (!token) return false;
//   try {
//     const decoded = jwtDecode(token);
//     // expiry check
//     return decoded.exp * 1000 > Date.now();
//   } catch (e) {
//     return false;
//   }
// }

// export function getUser() {
//   const token = localStorage.getItem("token");
//   if (!token) return null;
//   try {
//     return jwtDecode(token);
//   } catch (e) {
//     return null;
//   }
// }

// export function logout() {
//   localStorage.removeItem("token");
// }
