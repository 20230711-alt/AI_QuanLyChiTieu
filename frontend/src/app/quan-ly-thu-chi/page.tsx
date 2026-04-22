"use client";

import { useState, useEffect } from "react";

const formatTien = (so: number) => {
  return so.toLocaleString("vi-VN");
};

type GiaoDich = {
  id: number;
  loai: "thu" | "chi";
  soTien: number;
  danhMuc: string;
  moTa: string;
  ngay: string;
};

export default function ThuChiPage() {
  const [ds, setDs] = useState<GiaoDich[]>([]);
  const [editing, setEditing] = useState<GiaoDich | null>(null);

  const [form, setForm] = useState({
    loai: "chi",
    soTien: "",
    danhMuc: "Ăn uống",
    moTa: "",
    ngay: "",
  });

  const [search, setSearch] = useState("");
  const [filterLoai, setFilterLoai] = useState("all");
  const [sort, setSort] = useState("new");

  // LOAD DATA
  useEffect(() => {
    fetch("http://127.0.0.1:8000/giaodich?user_id=1")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((i: any) => ({
          id: i.id,
          loai: i.loai,
          soTien: i.so_tien,
          danhMuc: i.danh_muc,
          moTa: i.mo_ta,
          ngay: i.ngay,
        }));
        setDs(mapped);
      });
  }, []);

  // CRUD
  const them = async () => {
    if (!form.soTien) return;

    await fetch("http://127.0.0.1:8000/giaodich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1,
        loai: form.loai,
        so_tien: Number(form.soTien),
        danh_muc: form.danhMuc,
        mo_ta: form.moTa,
        ngay: form.ngay || new Date().toISOString().split("T")[0],
      }),
    });
    window.dispatchEvent(new Event("reload-home"));
    window.dispatchEvent(new Event("reload-ngansach"));
    const res = await fetch("http://127.0.0.1:8000/giaodich?user_id=1");
    const data = await res.json();

    const mapped = data.map((i: any) => ({
      id: i.id,
      loai: i.loai,
      soTien: i.so_tien,
      danhMuc: i.danh_muc,
      moTa: i.mo_ta,
      ngay: i.ngay,
    }));

    setDs(mapped);
    setForm({ ...form, soTien: "", moTa: "" });
  };

  const xoa = (id: number) => {
    setDs(ds.filter((i) => i.id !== id));
  };

  const saveEdit = () => {
    if (!editing) return;
    setDs(ds.map((i) => (i.id === editing.id ? editing : i)));
    setEditing(null);
  };

  // STATS
  const tongThu = ds
    .filter((i) => i.loai === "thu")
    .reduce((a, b) => a + b.soTien, 0);

  const tongChi = ds
    .filter((i) => i.loai === "chi")
    .reduce((a, b) => a + b.soTien, 0);

  const soDu = tongThu - tongChi;

  // FILTER
  let locDs = ds.filter((i) => {
    return (
      (filterLoai === "all" || i.loai === filterLoai) &&
      i.moTa.toLowerCase().includes(search.toLowerCase())
    );
  });

  // SORT
  locDs = locDs.sort((a, b) => {
    if (sort === "new") return b.id - a.id;
    if (sort === "old") return a.id - b.id;
    if (sort === "high") return b.soTien - a.soTien;
    if (sort === "low") return a.soTien - b.soTien;
    return 0;
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-blue-600">
        💰 Quản lý thu chi
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Tổng thu</p>
          <h2 className="text-green-600 font-bold">{formatTien(tongThu)} đ</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Tổng chi</p>
          <h2 className="text-red-500 font-bold">{formatTien(tongChi)} đ</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Số dư</p>
          <h2 className="text-blue-600 font-bold">{formatTien(soDu)} đ</h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3 flex-wrap">
        <input
          placeholder="🔍 Tìm kiếm..."
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          onChange={(e) => setFilterLoai(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Tất cả</option>
          <option value="thu">Thu</option>
          <option value="chi">Chi</option>
        </select>

        <select
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="new">Mới nhất</option>
          <option value="old">Cũ nhất</option>
          <option value="high">Tiền cao → thấp</option>
          <option value="low">Tiền thấp → cao</option>
        </select>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3 flex-wrap">
        <select
          onChange={(e) =>
            setForm({ ...form, loai: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="thu">Thu</option>
          <option value="chi">Chi</option>
        </select>

        {/* INPUT TIỀN (FORMAT) */}
        <input
  placeholder="Số tiền"
  value={form.soTien}
  onChange={(e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setForm({ ...form, soTien: raw });
  }}
  className="border p-2 rounded"
/>

        <select
          onChange={(e) =>
            setForm({ ...form, danhMuc: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option>Ăn uống</option>
          <option>Đi lại</option>
          <option>Học tập</option>
          <option>Mua sắm</option>
          <option>Giải trí</option>
          <option>Sức khỏe</option>
          <option>Tiền nhà</option>
          <option>Hóa đơn</option>
          <option>Du lịch</option>
          <option>Tiền lương</option>
          <option>Khác</option>
        </select>

        <input
          type="date"
          onChange={(e) =>
            setForm({ ...form, ngay: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Ghi chú"
          value={form.moTa}
          onChange={(e) =>
            setForm({ ...form, moTa: e.target.value })
          }
          className="border p-2 rounded"
        />

        <button
          onClick={them}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Thêm
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        {locDs.length === 0 ? (
          <p className="text-gray-400 text-center">
            📭 Chưa có giao dịch
          </p>
        ) : (
          locDs.map((i) => (
            <div
              key={i.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <span className="px-2 py-1 bg-gray-200 rounded text-sm mr-2">
                  {i.danhMuc}
                </span>
                <span>{i.moTa}</span>
                <p className="text-xs text-gray-400">{i.ngay}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={
                    i.loai === "thu"
                      ? "text-green-600 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {i.loai === "thu" ? "+" : "-"}
                  {formatTien(i.soTien)}
                </span>

                <button
                  onClick={() => setEditing(i)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => xoa(i.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL EDIT */}
      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl space-y-3 w-96">
            <h2 className="font-bold">Sửa giao dịch</h2>

            <input
              value={formatTien(editing.soTien)}
              onChange={(e) => {
                const raw = e.target.value.replace(/\./g, "");
                setEditing({
                  ...editing,
                  soTien: Number(raw),
                });
              }}
              className="border p-2 w-full"
            />

            <input
              value={editing.moTa}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  moTa: e.target.value,
                })
              }
              className="border p-2 w-full"
            />

            <button
              onClick={saveEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}