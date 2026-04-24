
"use client";

import { useEffect, useState } from "react";

type Reminder = {
  id: number;
  noi_dung: string;
  ngay: string;
  lap_lai: boolean;
  da_hoan_thanh: boolean; // thêm mới
};

export default function NhacNhoPage() {
  const [noiDung, setNoiDung] = useState("");
  const [ngay, setNgay] = useState("");
  const [lapLai, setLapLai] = useState(false);
  const [list, setList] = useState<Reminder[]>([]);

  const API = "http://127.0.0.1:8000/nhacnho";

  // =============================
  // LOAD DATA
  // =============================
  const fetchData = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =============================
  // THÊM NHẮC NHỞ
  // =============================
  const handleAdd = async () => {
    if (!noiDung || !ngay) return;

    await fetch(API + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noi_dung: noiDung,
        ngay: ngay,
        lap_lai: lapLai,
      }),
    });

    setNoiDung("");
    setNgay("");
    setLapLai(false);
    fetchData();
  };

  // =============================
  // XÓA
  // =============================
  const handleDelete = async (id: number) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    fetchData();
  };

  // =============================
  //  HOÀN THÀNH
  // =============================
  const handleComplete = async (id: number) => {
    await fetch(`${API}/complete/${id}`, {
      method: "PUT",
    });
    fetchData();
  };

  // =============================
  // NHẮC HÔM NAY
  // =============================
  const today = new Date().toISOString().split("T")[0];
  const todayList = list.filter(
    (item) => item.ngay === today && !item.da_hoan_thanh
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⏰ Quản lý nhắc nhở</h1>

      {/* FORM */}
      <div className="flex gap-3 mb-6">
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Nội dung (điện, trả nợ...)"
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={ngay}
          onChange={(e) => setNgay(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lapLai}
            onChange={(e) => setLapLai(e.target.checked)}
          />
          Lặp lại hàng tháng
        </label>

        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Thêm
        </button>
      </div>

      {/* THÔNG BÁO */}
      <div className="bg-yellow-100 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">🔔 Thông báo</h2>
        {todayList.length === 0 ? (
          <p>Không có nhắc hôm nay</p>
        ) : (
          <ul>
            {todayList.map((item) => (
              <li key={item.id}>• {item.noi_dung}</li>
            ))}
          </ul>
        )}
      </div>

      {/* DANH SÁCH */}
      {list.length === 0 ? (
        <p>Chưa có nhắc nhở</p>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded border flex justify-between items-center ${
                item.da_hoan_thanh ? "bg-gray-200 line-through" : ""
              }`}
            >
              <div>
                <p>{item.noi_dung}</p>
                <p className="text-sm text-gray-500">{item.ngay}</p>
              </div>

              <div className="flex gap-2">
                {/*  CHECK HOÀN THÀNH */}
                {!item.da_hoan_thanh && (
                  <button
                    onClick={() => handleComplete(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    ✔
                  </button>
                )}

                {/* XÓA */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

