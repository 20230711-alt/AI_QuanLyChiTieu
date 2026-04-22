import axios from "axios";

const API = "http://127.0.0.1:8000"; // backend FastAPI của bạn

export const dangnhap = async (data: any) => {
  const res = await axios.post(`${API}/login`, data);
  return res.data;
};

export const dangky = async (data: any) => {
  const res = await axios.post(`${API}/dangky`, data);
  return res.data;
};