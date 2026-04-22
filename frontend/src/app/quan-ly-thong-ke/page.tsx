"use client";

import { useEffect, useState } from "react";
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

const getCurrentMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
};

export default function ThongKePage() {
  const [thang, setThang] = useState(getCurrentMonth);
  const [tongThu, setTongThu] = useState(0);
  const [tongChi, setTongChi] = useState(0);
  const [soDu, setSoDu] = useState(0);
  const [error, setError] = useState("");
  const [dataDanhMuc, setDataDanhMuc] = useState<DanhMuc[]>([]);
  const [dataNgay, setDataNgay] = useState<{ ngay: string; value: number }[]>([]);

  const format = (n: number) => n.toLocaleString("vi-VN");

  const load = async () => {
    try {
      setError("");

      const res = await fetch(`${API}?thang=${thang}&user_id=1`);
      if (!res.ok) {
        throw new Error(`Khong tai duoc thong ke (${res.status})`);
      }

      const data = await res.json();

      setTongThu(Number(data.tong_thu) || 0);
      setTongChi(Number(data.tong_chi) || 0);
      setSoDu(Number(data.so_du) || 0);

      const dm = Object.entries(data.chi_theo_danh_muc || {}).map(([k, v]) => ({
        name: k,
        value: Number(v) || 0,
      }));

      const ngay = Object.entries(data.chi_theo_ngay || {}).map(([k, v]) => ({
        ngay: `Ngay ${k}`,
        value: Number(v) || 0,
      }));

      setDataDanhMuc(dm);
      setDataNgay(ngay);
    } catch (err) {
      console.error("Lỗi thống kê:", err);
      setError("Không tải được tài liệu thống kê.");
      setTongThu(0);
      setTongChi(0);
      setSoDu(0);
      setDataDanhMuc([]);
      setDataNgay([]);
    }
  };

  useEffect(() => {
    load();
  }, [thang]);

  const total = tongThu + tongChi;
  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
  const topDanhMuc = [...dataDanhMuc].sort((a, b) => b.value - a.value)[0];
  const formatShortMoney = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
    }

    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Thống kê tài chính</h1>

        <input
          type="month"
          value={thang}
          onChange={(e) => setThang(e.target.value)}
          className="rounded border p-2"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-4 shadow">
          <p>Tổng thu</p>
          <h2 className="font-bold text-green-600">{format(tongThu)} d</h2>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <p>Tổng chi</p>
          <h2 className="font-bold text-red-500">{format(tongChi)} d</h2>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <p>Số dư</p>
          <h2 className="font-bold text-blue-600">{format(soDu)} d</h2>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Thu vs Chi</h3>

        <div className="h-4 rounded bg-gray-200">
          <div
            className="h-4 rounded bg-green-500"
            style={{ width: total ? `${(tongThu / total) * 100}%` : "0%" }}
          />
        </div>

        <div className="mt-2 h-4 rounded bg-gray-200">
          <div
            className="h-4 rounded bg-red-500"
            style={{ width: total ? `${(tongChi / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="mb-2 font-semibold">Chi theo danh muc</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dataDanhMuc} dataKey="value" nameKey="name" outerRadius={80}>
                {dataDanhMuc.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="mb-2 font-semibold">Chi theo ngay</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={dataNgay}
              margin={{ top: 8, right: 12, left: 24, bottom: 0 }}
            >
              <XAxis dataKey="ngay" />
              <YAxis width={64} tickFormatter={formatShortMoney} />
              <Tooltip formatter={(value: number | string) => format(Number(value))} />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="font-semibold">Phân tích</h3>
        {topDanhMuc && (
          <p>
            Bạn chi tiêu nhiều nhất vào: <b>{topDanhMuc.name}</b>
          </p>
        )}
      </div>
    </div>
  );
}
