"use client";

import { useState } from "react";

type NhacNho = {
  id: number;
  noiDung: string;
  ngay: string;
  lapLai: boolean;
};

export default function NhacNhoPage() {
  const [ds, setDs] = useState<NhacNho[]>([]);
  const [noiDung, setNoiDung] = useState("");
  const [ngay, setNgay] = useState("");
  const [lapLai, setLapLai] = useState(false);

  const them = () => {
    if (!noiDung || !ngay) return;

    setDs([
      ...ds,
      {
        id: Date.now(),
        noiDung,
        ngay,
        lapLai,
      },
    ]);

    setNoiDung("");
    setNgay("");
    setLapLai(false);
  };

  const xoa = (id: number) => {
    setDs(ds.filter((i) => i.id !== id));
  };

  const homNay = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-blue-600">
        ⏰ Quản lý nhắc nhở
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3 flex-wrap">
        <input
          placeholder="Nội dung (điện, trả nợ...)"
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={ngay}
          onChange={(e) => setNgay(e.target.value)}
          className="border p-2 rounded"
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
          onClick={them}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Thêm
        </button>
      </div>

      {/* DANH SÁCH */}
      <div className="space-y-4">
        {ds.map((i) => {
          const isTre = i.ngay < homNay;

          return (
            <div
              key={i.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{i.noiDung}</h3>

                <p className="text-sm text-gray-500">
                  📅 {i.ngay} {i.lapLai && "(Lặp hàng tháng)"}
                </p>

                <p
                  className={`text-xs ${
                    isTre ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {isTre ? "⚠️ Trễ hạn" : "Sắp tới"}
                </p>
              </div>

              <button
                onClick={() => xoa(i.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Xóa
              </button>
            </div>
          );
        })}

        {ds.length === 0 && (
          <p className="text-gray-400">Chưa có nhắc nhở</p>
        )}
      </div>

      {/* THÔNG BÁO (UI giả) */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">🔔 Thông báo</h3>

        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Nhắc đóng tiền điện ngày 30</li>
          <li>• Nhắc trả nợ ngày 25</li>
        </ul>
      </div>
    </div>
  );
}