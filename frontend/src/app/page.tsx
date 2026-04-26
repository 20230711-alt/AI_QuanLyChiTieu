"use client";

import { useEffect, useState } from "react";
import PieChartBox from "@/components/charts/PieChartBox";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const [tongThu, setTongThu] = useState(0);
  const [tongChi, setTongChi] = useState(0);
  const [gd, setGd] = useState<any[]>([]);

  const [chartData, setChartData] = useState<any[]>([]);
  const [soDu, setSoDu] = useState(0);

  // ✅ FORMAT TIỀN VND (THÊM)
  const formatVND = (value: number) => {
    return value.toLocaleString("vi-VN") + "đ";
  };

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    const u = localStorage.getItem("username");
    const r = localStorage.getItem("role");

    if (u) setUsername(u);
    if (r) setRole(r);
  }, []);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/giaodich?user_id=1");
        const data = await res.json();

        if (!Array.isArray(data)) return;

        let thu = 0;
        let chi = 0;

        const danhMuc: any = {};

        data.forEach((i: any) => {
          const loai = i.loai.toLowerCase();

          if (loai === "thu") {
            thu += i.so_tien;
          } else {
            const amount = Math.abs(i.so_tien);
            chi += amount;

            const key = i.danh_muc || "Khác";
            if (!danhMuc[key]) danhMuc[key] = 0;
            danhMuc[key] += amount;
          }
        });

        setTongThu(thu);
        setTongChi(Math.abs(chi));
        setSoDu(thu - chi);

        // 👉 CHART
        const chart = Object.entries(danhMuc).map(([key, value]) => ({
          name: key,
          value: value,
        }));

        setChartData(chart);

        // 👉 GIAO DỊCH GẦN ĐÂY
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.ngay).getTime() - new Date(a.ngay).getTime()
        );

        setGd(sorted.slice(0, 5));

      } catch (err) {
        console.error("Lỗi load dashboard:", err);
      }
    };

    load();

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
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Tổng chi</p>
          <h2 className="text-2xl font-bold text-red-500">
            {formatVND(tongChi)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Thu nhập</p>
          <h2 className="text-2xl font-bold text-green-500">
            {formatVND(tongThu)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Tiết kiệm</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {formatVND(tongThu - tongChi)}
          </h2>
        </div>
      </div>

      {/* CHART + GIAO DỊCH */}
      <div className="grid grid-cols-2 gap-6">

        {/* CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            📈 Biểu đồ chi tiêu
          </h2>

          {chartData.length === 0 ? (
            <p className="text-gray-400 text-center">
              Chưa có dữ liệu
            </p>
          ) : (
            <PieChartBox data={chartData} />
          )}
        </div>

        {/* GIAO DỊCH */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            🧾 Giao dịch gần đây
          </h2>

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
                  {formatVND(Math.abs(i.so_tien))}
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

          {tongChi > tongThu ? (
            <p className="text-red-500">
              ❌ Bạn đang chi vượt thu!
            </p>
          ) : tongChi > tongThu * 0.8 ? (
            <p className="text-yellow-500">
              ⚠️ Bạn đã tiêu hơn 80% thu nhập
            </p>
          ) : (
            <p className="text-green-600">
              ✅ Tài chính ổn định
            </p>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">🤖 AI gợi ý</h2>

          {tongChi > tongThu ? (
            <p>Bạn nên giảm chi tiêu ngay 🚨</p>
          ) : (
            <p>
              Bạn đang tiết kiệm{" "}
              {tongThu > 0
                ? ((soDu / tongThu) * 100).toFixed(0)
                : 0}
              %
            </p>
          )}
        </div>
      </div>
    </div>
  );
}