"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const API = "http://127.0.0.1:8000/thongke/";

type DanhMuc = {
  name: string;
  value: number;
};

export default function ThongKePage() {
  const [thang, setThang] = useState("2026-04");

  const [tongThu, setTongThu] = useState(0);
  const [tongChi, setTongChi] = useState(0);
  const [soDu, setSoDu] = useState(0);

  const [dataDanhMuc, setDataDanhMuc] = useState<DanhMuc[]>([]);
  const [dataNgay, setDataNgay] = useState<any[]>([]);

  const format = (n: number) => n.toLocaleString("vi-VN");

  // =========================
  // LOAD DATA TỪ BACKEND
  // =========================
  const load = async () => {
    try {
      const res = await fetch(API + `?thang=${thang}`);
      const data = await res.json();

      setTongThu(data.tong_thu || 0);
      setTongChi(data.tong_chi || 0);
      setSoDu(data.so_du || 0);

      // 👉 danh mục → pie chart
      const dm = Object.entries(data.chi_theo_danh_muc || {}).map(
        ([k, v]: any) => ({
          name: k,
          value: v,
        })
      );

      setDataDanhMuc(dm);

      // 👉 theo ngày → bar chart
      const ngay = Object.entries(data.chi_theo_ngay || {}).map(
        ([k, v]: any) => ({
          ngay: `Ngày ${k}`,
          value: v,
        })
      );

      setDataNgay(ngay);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  useEffect(() => {
    load();
  }, [thang]);

  const total = tongThu + tongChi;

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Thống kê tài chính
        </h1>

        <input
          type="month"
          value={thang}
          onChange={(e) => setThang(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* TỔNG */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Tổng thu</p>
          <h2 className="text-green-600 font-bold">
            {format(tongThu)} đ
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Tổng chi</p>
          <h2 className="text-red-500 font-bold">
            {format(tongChi)} đ
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Số dư</p>
          <h2 className="text-blue-600 font-bold">
            {format(soDu)} đ
          </h2>
        </div>
      </div>

      {/* THU VS CHI */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="mb-2 font-semibold">Thu vs Chi</h3>

        <div className="bg-gray-200 h-4 rounded">
          <div
            className="bg-green-500 h-4 rounded"
            style={{
              width: total ? `${(tongThu / total) * 100}%` : "0%",
            }}
          ></div>
        </div>

        <div className="bg-gray-200 h-4 rounded mt-2">
          <div
            className="bg-red-500 h-4 rounded"
            style={{
              width: total ? `${(tongChi / total) * 100}%` : "0%",
            }}
          ></div>
        </div>
      </div>

      {/* CHART */}
      <div className="grid grid-cols-2 gap-4">

        {/* PIE */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="mb-2 font-semibold">Chi theo danh mục</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataDanhMuc}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                {dataDanhMuc.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="mb-2 font-semibold">Chi theo ngày</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataNgay}>
              <XAxis dataKey="ngay" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PHÂN TÍCH */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold">Phân tích</h3>

        {dataDanhMuc.length > 0 && (
          <p>
            Bạn chi nhiều nhất vào:{" "}
            <b>
              {
                dataDanhMuc.sort((a, b) => b.value - a.value)[0].name
              }
            </b>
          </p>
        )}
      </div>

    </div>
  );
}