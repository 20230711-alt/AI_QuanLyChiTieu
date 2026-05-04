"use client";

import { useState, useEffect } from "react";

type Budget = {
  id: number;
  ten: string;
  gioiHan: number;
  daDung: number;
};

export default function NganSachPage() {
  const [ds, setDs] = useState<Budget[]>([
    { id: 1, ten: "Ăn uống", gioiHan: 3000000, daDung: 2500000 },
    { id: 2, ten: "Mua sắm", gioiHan: 2000000, daDung: 2100000 },
  ]);

  const [ten, setTen] = useState("");
  const [gioiHan, setGioiHan] = useState("");
  const [thang, setThang] = useState("2026-04");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [date, setDate] = useState("");
  const [mode, setMode] = useState("month");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [daysHaveData, setDaysHaveData] = useState<string[]>([]);
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const getQuery = () => {
    if (!date) return "";

    if (mode === "day") return date;
    if (mode === "month") return date.slice(0, 7);
    if (mode === "year") return date.slice(0, 4);
  };

  // LOAD DATA
  useEffect(() => {
    const load = () => {
      const query = getQuery();

      fetch(
        fromDate && toDate
          ? `http://127.0.0.1:8000/ngansach?from_date=${fromDate}&to_date=${toDate}`
          : query
          ? `http://127.0.0.1:8000/ngansach?time=${query}&mode=${mode}`
          : "http://127.0.0.1:8000/ngansach"
      )
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) return;

          const mapped = data.map((i: any) => ({
            id: i.id,
            ten: i.danh_muc,
            gioiHan: i.gioi_han,
            daDung: i.da_dung,
          }));

          setDs(mapped);
        });
    };

    load();

    window.addEventListener("reload-ngansach", load);

    return () => {
      window.removeEventListener("reload-ngansach", load);
    };
  }, [date, mode, fromDate, toDate]);

  // LOAD NGÀY CÓ CHI TIÊU
  useEffect(() => {
    fetch("http://127.0.0.1:8000/giaodich?user_id=1")
      .then((res) => res.json())
      .then((data) => {
        const days = data.map((i: any) => i.ngay);
        setDaysHaveData(days);
      });
  }, []);

  // QUICK FILTER
  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
  };

  const setWeek = () => {
    const now = new Date();
    const first = new Date(now.setDate(now.getDate() - now.getDay()));
    const last = new Date(now.setDate(first.getDate() + 6));

    setFromDate(first.toISOString().split("T")[0]);
    setToDate(last.toISOString().split("T")[0]);
  };

  const setMonth = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFromDate(first.toISOString().split("T")[0]);
    setToDate(last.toISOString().split("T")[0]);
  };

  const them = async () => {
    if (!ten || !gioiHan) return;

    const parsed = Number(gioiHan.replace(/\./g, ""));

    try {
      if (editingId !== null) {
        await fetch(`http://127.0.0.1:8000/ngansach/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ten, gioiHan: parsed, thang }),
        });
      } else {
        await fetch("http://127.0.0.1:8000/ngansach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ten, gioiHan: parsed, thang }),
        });
      }

      window.dispatchEvent(new Event("reload-ngansach"));
      window.dispatchEvent(new Event("reload-home"));
      showNotification(editingId ? "✅ Cập nhật ngân sách thành công!" : "✅ Thêm ngân sách thành công!");
    } catch (err) {
      console.error("Lỗi:", err);
    }

    setTen("");
    setGioiHan("");
    setEditingId(null);
  };

  const xoa = async (id: number) => {
    const ok = confirm("Bạn có xác nhận xóa ngân sách không?");
    if (!ok) return;

    try {
      await fetch(`http://127.0.0.1:8000/ngansach/${id}`, { method: "DELETE" });
      setDs(ds.filter((i) => i.id !== id));
      showNotification("✅ Xóa ngân sách thành công!");
    } catch (err) {
      console.error(err);
    }
  };

  const tong = ds.reduce((a, b) => a + b.gioiHan, 0);
  const daDung = ds.reduce((a, b) => a + b.daDung, 0);

  return (
    <div className="space-y-6 relative">
      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 font-semibold transition-all">
          {notification}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-blue-600">
           Quản lý ngân sách
        </h1>

        {/*  RANGE DATE STYLE  */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />

          <span className="text-gray-400 font-bold">→</span>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* QUICK FILTER */}
        <div className="flex gap-2">
          <button onClick={setToday} className="bg-gray-200 px-3 py-1 rounded">
            Hôm nay
          </button>
          <button onClick={setWeek} className="bg-gray-200 px-3 py-1 rounded">
            Tuần
          </button>
          <button onClick={setMonth} className="bg-gray-200 px-3 py-1 rounded">
            Tháng
          </button>
        </div>

        {/* HIGHLIGHT */}
        {fromDate && daysHaveData.includes(fromDate) && (
          <p className="text-green-600 text-sm">
            📌 Có chi tiêu trong ngày
          </p>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Tổng ngân sách</p>
          <h2 className="text-blue-600 font-bold text-xl">
            {tong.toLocaleString("vi-VN")} đ
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Đã dùng</p>
          <h2 className="text-red-500 font-bold text-xl">
            {daDung.toLocaleString("vi-VN")} đ
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Còn lại</p>
          <h2 className="text-green-600 font-bold text-xl">
            {(tong - daDung).toLocaleString("vi-VN")} đ
          </h2>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3 flex-wrap">
        <input
          placeholder="Danh mục"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Giới hạn"
          value={gioiHan}
          onChange={(e) => setGioiHan(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={them}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? " Cập nhật" : "+ Thêm ngân sách"}
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-2 gap-4">
        {ds.map((i) => {
          const percent =
            i.gioiHan > 0 ? (i.daDung / i.gioiHan) * 100 : 0;

          return (
            <div key={i.id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{i.ten}</h3>
                <span className="text-sm text-gray-500">
                  {i.daDung.toLocaleString("vi-VN")} /{" "}
                  {i.gioiHan.toLocaleString("vi-VN")}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    percent > 100
                      ? "bg-red-600"
                      : percent > 70
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                ></div>
              </div>

              <p className="text-xs mt-1 text-gray-500">
                {percent.toFixed(0)}% đã sử dụng
              </p>

              {percent > 100 && (
                <p className="text-red-500 text-sm mt-1">
                  ⚠️ Vượt ngân sách!
                </p>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setTen(i.ten);
                    setGioiHan(i.gioiHan.toString());
                    setEditingId(i.id);
                  }}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => xoa(i.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {ds.length === 0 && (
        <p className="text-gray-400">Chưa có ngân sách</p>
      )}
    </div>
  );
}