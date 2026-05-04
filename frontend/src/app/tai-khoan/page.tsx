"use client";

import { useState, useEffect } from "react";

export default function TaiKhoanPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    sdt: "",
    diaChi: "",
  });
  const [initialForm, setInitialForm] = useState({
    username: "",
    email: "",
    password: "",
    sdt: "",
    diaChi: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      fetch(`http://127.0.0.1:8000/api/profile/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.message) {
            const userData = {
              username: data.username || "",
              email: data.email || "",
              password: data.password || "",
              sdt: data.sdt || "",
              diaChi: data.dia_chi || "",
            };
            setForm(userData);
            setInitialForm(userData);
          }
        })
        .catch((err) => console.error("Lỗi lấy thông tin tài khoản:", err));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/profile/${form.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          sdt: form.sdt,
          dia_chi: form.diaChi,
        }),
      });

      const data = await res.json();
      if (data.message === "Cập nhật thành công") {
        setMessage("✅ Cập nhật thông tin thành công!");
        setInitialForm(form);
      } else {
        setMessage("❌ Cập nhật thất bại.");
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối server.");
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6  ">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">Quản lý tài khoản</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="space-y-4">
          
          <div>
            <label className="block text-gray-500 mb-1">Tên đăng nhập (Không thể đổi)</label>
            <input
              value={form.username}
              disabled
              className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-500 mb-1">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-gray-500 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-gray-500 mb-1">Số điện thoại</label>
            <input
              value={form.sdt}
              onChange={(e) => setForm({ ...form, sdt: e.target.value })}
              className="w-full border p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-gray-500 mb-1">Địa chỉ</label>
            <input
              value={form.diaChi}
              onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
              className="w-full border p-2 rounded text-black"
            />
          </div>

          {message && (
            <p className={`text-sm font-bold ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading || JSON.stringify(form) === JSON.stringify(initialForm)}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                loading || JSON.stringify(form) === JSON.stringify(initialForm)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Đang lưu..." : "Cập nhật thông tin"}
            </button>

            {JSON.stringify(form) !== JSON.stringify(initialForm) && (
              <button
                onClick={() => {
                  setForm(initialForm);
                  setMessage("");
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Hủy cập nhật
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
