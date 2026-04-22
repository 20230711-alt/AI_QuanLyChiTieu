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

  //  THÊM STATE EDIT (NEW)
  const [editingId, setEditingId] = useState<number | null>(null);

  //  LOAD DỮ LIỆU
  useEffect(() => {
    const load = () => {
      fetch("http://127.0.0.1:8000/ngansach")
        .then(res => res.json())
        .then(data => {
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
  }, []);

  //  THÊM + UPDATE
  const them = async () => {
    if (!ten || !gioiHan) return;

    const parsed = Number(gioiHan.replace(/\./g, ""));

    try {
      //  nếu đang sửa
      if (editingId !== null) {
        await fetch(`http://127.0.0.1:8000/ngansach/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ten,
            gioiHan: parsed,
            thang,
          }),
        });
      } else {
        //  thêm mới (giữ nguyên logic)
        await fetch("http://127.0.0.1:8000/ngansach", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ten,
            gioiHan: parsed,
            thang,
          }),
        });
      }

      //  reload lại DB (giữ nguyên cách bạn đang làm)
      const res = await fetch("http://127.0.0.1:8000/ngansach");
      const data = await res.json();

      if (Array.isArray(data)) {
        const mapped = data.map((i: any) => ({
          id: i.id,
          ten: i.danh_muc,
          gioiHan: i.gioi_han,
          daDung: i.da_dung
        }));
        setDs(mapped);
      }
    window.dispatchEvent(new Event("reload-home"));
    } catch (err) {
      console.error("Lỗi:", err);

      // fallback giữ nguyên
      setDs([
        ...ds,
        {
          id: Date.now(),
          ten,
          gioiHan: parsed,
          daDung: 0,
        },
      ]);
    }

    // reset form
    setTen("");
    setGioiHan("");
    setEditingId(null); // 
  };

  const xoa = (id: number) => {
    setDs(ds.filter((i) => i.id !== id));
  };

  const tong = ds.reduce((a, b) => a + b.gioiHan, 0);
  const daDung = ds.reduce((a, b) => a + b.daDung, 0);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
           Quản lý ngân sách
        </h1>

        <input
          type="month"
          value={thang}
          onChange={(e) => setThang(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* TỔNG QUAN */}
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

      {/* DANH SÁCH */}
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
                {/*  SỬA */}
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