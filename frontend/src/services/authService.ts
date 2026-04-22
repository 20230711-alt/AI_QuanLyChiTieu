import axios from "axios";

const API = "http://127.0.0.1:8000"; // backend FastAPI

// 🔐 LOGIN (dùng username)
export const login = async (data: {
  username: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/login`, data);
  return res.data;
};

// 📝 REGISTER (vẫn giữ email + name)
export const register = async (data: {
  username: string;
  password: string;
  email: string;
  sdt: string;
  dia_chi: string;
}) => {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
};