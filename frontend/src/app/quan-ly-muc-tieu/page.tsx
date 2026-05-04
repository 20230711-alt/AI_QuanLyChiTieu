"use client";

import { useState, useEffect } from "react";

type MucTieu = {
  id: number;
  ten: string;
  mucTieu: number;
  daDat: number;
  han: string;
};

const API = "http://127.0.0.1:8000/muctieu/"; // ✅ chuẩn hoá URL

export default function MucTieuPage() {
  const [ds, setDs] = useState<MucTieu[]>([]);
  const [ten, setTen] = useState("");
  const [soTien, setSoTien] = useState("");
  const [han, setHan] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [soDu, setSoDu] = useState(0);
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  // =========================
  // LOAD MỤC TIÊU
  // =========================
  const load = async () => {
    try {
      const res = await fetch(API);

      if (!res.ok) {
        console.error("API lỗi:", await res.text());
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) return;

      const mapped = data.map((i: any) => ({
        id: i.id,
        ten: i.ten,
        mucTieu: i.muc_tieu,
        daDat: i.da_dat || 0,
        han: i.deadline,
      }));

      setDs(mapped);
    } catch (err) {
      console.error("Lỗi load mục tiêu:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // LOAD SỐ DƯ
  // =========================
  const loadSoDu = async () => {
    try {
      const res = await fetch(API + "so-du");

      if (!res.ok) {
        console.error("API số dư lỗi:", await res.text());
        return;
      }

      const data = await res.json();
      setSoDu(data.so_du || 0);
    } catch (err) {
      console.error("Lỗi lấy số dư:", err);
    }
  };

  useEffect(() => {
    loadSoDu();
  }, []);

  // =========================
  // THÊM / UPDATE
  // =========================
  const them = async () => {
    if (!ten || !soTien) {
      alert("Vui lòng nhập đầy đủ");
      return;
    }

    try {
      const body: any = {
        ten,
        muc_tieu: Number(soTien),
      };

      if (han && han !== "") {
        body.deadline = han;
      }

      let res;

      if (editingId) {
        res = await fetch(`${API}${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      // kiểm tra lỗi backend
      if (!res.ok) {
        const text = await res.text();
        console.error("API lỗi:", text);
        alert("Thêm thất bại!");
        return;
      }

      //  reload chuẩn
      await load();
      await loadSoDu();
      showNotification(editingId ? "✅ Cập nhật mục tiêu thành công!" : "✅ Thêm mục tiêu thành công!");

    } catch (err) {
      console.error("Lỗi:", err);
    }

    setTen("");
    setSoTien("");
    setHan("");
    setEditingId(null);
  };

  // =========================
  // THÊM TIỀN
  // =========================
  const themTien = async (id: number) => {
    const tien = prompt("Nhập số tiền thêm:");
    if (!tien) return;

    try {
      const res = await fetch(`${API}${id}/them-tien`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          so_tien: Number(tien),
        }),
      });

      if (!res.ok) {
        console.error("Lỗi thêm tiền:", await res.text());
        return;
      }

      await load();
      await loadSoDu();
      showNotification("✅ Thêm tiền thành công!");
    } catch (err) {
      console.error("Lỗi thêm tiền:", err);
    }
  };

  // =========================
  // XOÁ
  // =========================
  const xoa = async (id: number) => {
    try {
      const res = await fetch(`${API}${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Xoá lỗi:", await res.text());
        return;
      }

      await load();
      await loadSoDu();
      showNotification("✅ Xoá mục tiêu thành công!");
    } catch (err) {
      console.error("Lỗi xoá:", err);
    }
  };

  const tong = ds.reduce((a, b) => a + b.mucTieu, 0);

  return (
    <div className="space-y-6 relative">
      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 font-semibold transition-all">
          {notification}
        </div>
      )}

      <h1 className="text-2xl font-bold text-blue-600">
        Quản lý mục tiêu
      </h1>

      {/* TỔNG */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Tổng mục tiêu</p>
          <h2 className="text-blue-600 font-bold">
            {tong.toLocaleString()} đ
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Đã tiết kiệm</p>
          <h2 className="text-green-600 font-bold">
            {soDu.toLocaleString()} đ
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Hoàn thành</p>
          <h2 className="text-purple-600 font-bold">
            {tong ? ((soDu / tong) * 100).toFixed(0) : 0}%
          </h2>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3 flex-wrap">
        <input
          placeholder="Tên mục tiêu"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Số tiền"
          value={soTien}
          onChange={(e) => setSoTien(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={han}
          onChange={(e) => setHan(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={them}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Cập nhật" : "+ Thêm mục tiêu"}
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto p-4">
          <div className="space-y-4">
            {ds.map((i) => {
              const percent =
                i.mucTieu > 0 ? (i.daDat / i.mucTieu) * 100 : 0;

              const monthsLeft = i.han
                ? Math.max(
                    1,
                    Math.ceil(
                      (new Date(i.han).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )
                  )
                : 1;

              const goiY = Math.round((i.mucTieu - i.daDat) / monthsLeft);

              return (
                <div key={i.id} className="bg-gray-50 p-4 rounded-xl">

                  <div className="flex justify-between">
                    <h3 className="font-semibold">{i.ten}</h3>
                    <span className="text-sm text-gray-500">
                      Hạn: {i.han || "Không có"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {i.daDat.toLocaleString()} / {i.mucTieu.toLocaleString()} đ
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    ></div>
                  </div>

                  <p className="text-xs mt-1 text-gray-500">
                    {percent.toFixed(0)}% hoàn thành
                  </p>

                  <p className="text-xs text-purple-600 mt-1">
                    Cần tiết kiệm ~{goiY.toLocaleString()} đ / tháng
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => themTien(i.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      + Thêm tiền
                    </button>

                    <button
                      onClick={() => {
                        setTen(i.ten);
                        setSoTien(i.mucTieu.toString());
                        setHan(i.han);
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
        </div>
      </div>

      {ds.length === 0 && (
        <p className="text-gray-400">Chưa có mục tiêu</p>
      )}
    </div>
  );
}