"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  // 👉 THÊM STATE CHO DATA THẬT
  const [tongThu, setTongThu] = useState(0);
  const [tongChi, setTongChi] = useState(0);

  // ✅ THÊM STATE GIAO DỊCH (NEW)
  const [gd, setGd] = useState<any[]>([]);

  useEffect(() => {
    const u = localStorage.getItem("username");
    const r = localStorage.getItem("role");

    if (u) setUsername(u);
    if (r) setRole(r);
  }, []);

  // 👉 LOAD DỮ LIỆU TỪ BACKEND + AUTO RELOAD
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/giaodich?user_id=1");
        const data = await res.json();

        if (!Array.isArray(data)) return;

        let thu = 0;
        let chi = 0;

        data.forEach((i: any) => {
          const loai = i.loai.toLowerCase();

          if (loai === "thu") {
            thu += i.so_tien;
          } else {
            chi += Math.abs(i.so_tien);
          }
        });

        setTongThu(thu);
        setTongChi(Math.abs(chi));

        // ✅ THÊM: set giao dịch gần đây (NEW)
        const sorted = [...data].sort(
          (a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime()
        );

        setGd(sorted.slice(0, 5)); // lấy 5 giao dịch mới nhất

      } catch (err) {
        console.error("Lỗi load dashboard:", err);
      }
    };

    load();

    // 👉 nghe event từ các page khác
    window.addEventListener("reload-home", load);

    return () => {
      window.removeEventListener("reload-home", load);
    };
  }, []);

  return (
  <div className="space-y-6">

    {/* HEADER */}
    <div>
      <h2 className="text-xl font-semibold mb-1 text-gray-700">
        {role === "admin"
          ? "Chào admin 👑"
          : username
          ? `Chào ${username} 👋`
          : "Chào"}
      </h2>

      <h1 className="text-3xl font-bold text-blue-700">
        📊 Trang chủ (Tổng quan)
      </h1>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
        <p className="text-gray-500">Tổng chi</p>
        <h2 className="text-2xl font-bold text-red-500">
          {tongChi.toLocaleString("vi-VN")}đ
        </h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
        <p className="text-gray-500">Thu nhập</p>
        <h2 className="text-2xl font-bold text-green-500">
          {tongThu.toLocaleString("vi-VN")}đ
        </h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
        <p className="text-gray-500">Tiết kiệm</p>
        <h2 className="text-2xl font-bold text-blue-600">
          {(tongThu - tongChi).toLocaleString("vi-VN")}đ
        </h2>
      </div>
    </div>

    {/* CHART + GIAO DỊCH */}
    <div className="grid grid-cols-2 gap-6">

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">📈 Biểu đồ chi tiêu</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          (Chart sẽ thêm sau)
        </div>
      </div>

      {/* ✅ GIAO DỊCH GẦN ĐÂY (ĐÃ FIX REALTIME) */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">🧾 Giao dịch gần đây</h2>

        <div className="space-y-2 text-sm">
          {gd.map((i) => (
            <div key={i.id} className="flex justify-between border-b pb-1">
              <span>{i.danh_muc}</span>
              <span
                className={
                  i.loai.toLowerCase() === "thu"
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {i.loai.toLowerCase() === "thu" ? "+" : "-"}
                {Math.abs(i.so_tien).toLocaleString("vi-VN")}đ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CẢNH BÁO + AI */}
    <div className="grid grid-cols-2 gap-6">

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-2">⚠️ Cảnh báo</h2>
        <p className="text-green-600">
          Tài chính của bạn đang ổn định 👍
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-2">🤖 AI gợi ý</h2>
        <p className="text-gray-600">
          Bạn nên tiết kiệm khoảng 20% thu nhập mỗi tháng.
        </p>
      </div>
    </div>
  </div>
);
}