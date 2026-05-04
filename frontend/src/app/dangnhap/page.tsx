"use client";

import { useState } from "react";
import { login } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function DangNhapPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [matKhau, setMatKhau] = useState("");

  //  thêm state lỗi
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    //  VALIDATE
    if (!username || !matKhau) {
      setError("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (matKhau.length < 6) {
      setError("⚠️ Mật khẩu phải lớn hơn hoặc bằng 6 ký tự!");
      return;
    }

    try {
      const res = await login({
        username,
        password: matKhau,
      });

      if (res.message === "Đăng nhập thành công") {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("role", res.role);
        localStorage.setItem("username", username);

        setError(""); // clear lỗi
        router.push("/");
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
        onSubmit={handleLogin}
        className="backdrop-blur-lg bg-white/20 p-10 rounded-2xl w-96 shadow-2xl border border-white/30"
      >
        <h2 className="text-3xl text-black text-center mb-6 font-semibold">
          ĐĂNG NHẬP
        </h2>

        <input
          placeholder="Tên đăng nhập"
          className={`w-full mb-4 p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-400 ${
            !username && error ? "border border-red-500" : ""
          }`}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={`w-full mb-4 p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-400 ${
            !matKhau && error ? "border border-red-500" : ""
          }`}
          onChange={(e) => setMatKhau(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 rounded-full hover:from-purple-700 hover:to-purple-900 transition">
          TRUY CẬP TÀI KHOẢN
        </button>

        {/*  HIỂN THỊ LỖI */}
        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {error}
          </p>
        )}

        <p
          onClick={() => router.push("/dangky")}
          className="text-black text-sm mt-4 text-center cursor-pointer"
        >
          Chưa có tài khoản? Đăng ký
        </p>
      </form>
    </div>
  );
}