"use client";

import { useState } from "react";
import { register } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function DangKyPage() {
  const router = useRouter();

  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [sdt, setSdt] = useState("");
  const [diaChi, setDiaChi] = useState("");

  //  THÊM ERROR
  const [error, setError] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();

    //  VALIDATE
    if (!ten || !email || !matKhau || !sdt || !diaChi) {
      setError("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!email.includes("@")) {
      setError("⚠️ Email không hợp lệ!");
      return;
    }

    if (matKhau.length < 6) {
      setError("⚠️ Mật khẩu phải lớn hơn hoặc bằng 6 ký tự!");
      return;
    }

    if (sdt.length < 9) {
      setError("⚠️ Số điện thoại không hợp lệ!");
      return;
    }

    try {
      const res = await register({
        username: ten,
        email: email,
        password: matKhau,
        sdt: sdt,
        dia_chi: diaChi,
      });

      if (res.message === "Đăng ký thành công") {
        alert("Đăng ký thành công");
        setError(""); // clear lỗi
        router.push("/dangnhap");
      } else {
        setError(res.message);
      }
    } catch {
      setError("❌ Lỗi server");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 to-purple-300 flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="backdrop-blur-lg bg-white/20 p-10 rounded-2xl w-96 shadow-2xl border border-white/30"
      >
        <h2 className="text-3xl text-black text-center mb-6 font-semibold">
          ĐĂNG KÝ
        </h2>

        <input
          placeholder="Tên"
          className={`w-full mb-4 p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-400 ${
            !ten && error ? "border border-red-500" : ""
          }`}
          onChange={(e) => setTen(e.target.value)}
        />

        <input
          placeholder="Email"
          className={`w-full mb-4 p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-400 ${
            !email && error ? "border border-red-500" : ""
          }`}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={`w-full mb-4 p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-400 ${
            !matKhau && error ? "border border-red-500" : ""
          }`}
          onChange={(e) => setMatKhau(e.target.value)}
        />

        <input
          type="text"
          placeholder="Số điện thoại"
          value={sdt}
          onChange={(e) => setSdt(e.target.value)}
          className={`w-full mb-4 p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-400 ${
            !sdt && error ? "border border-red-500" : ""
          }`}
        />

        <input
          type="text"
          placeholder="Địa chỉ"
          value={diaChi}
          onChange={(e) => setDiaChi(e.target.value)}
          className={`w-full mb-4 p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-400 ${
            !diaChi && error ? "border border-red-500" : ""
          }`}
        />

        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 rounded-full hover:from-purple-700 hover:to-purple-900 transition">
          TẠO TÀI KHOẢN
        </button>

        {/*  HIỂN THỊ LỖI */}
        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {error}
          </p>
        )}

        <p
          onClick={() => router.push("/dangnhap")}
          className="text-black text-sm mt-4 text-center cursor-pointer"
        >
          Đã có tài khoản? Đăng nhập
        </p>
      </form>
    </div>
  );
}