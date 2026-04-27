"use client";

import { useState, useEffect, useRef } from "react";

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

  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  // LOAD DATA
  useEffect(() => {
    fetch("http://127.0.0.1:8000/giaodich/?user_id=1")
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
    if (!form.soTien || loading || isSubmitting.current) return;

    isSubmitting.current = true;
    setLoading(true);

    try {
      console.log("Gửi lên:", form.loai); // DEBUG

      await fetch("http://127.0.0.1:8000/giaodich/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          loai: form.loai, // ✅ FIX: dùng trực tiếp
          so_tien: Number(form.soTien),
          danh_muc: form.danhMuc,
          mo_ta: form.moTa,
          ngay: form.ngay || new Date().toISOString().split("T")[0],
        }),
      });

      const res = await fetch("http://127.0.0.1:8000/giaodich/?user_id=1");
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

      // RESET FORM
      setForm({
        loai: "chi",
        soTien: "",
        danhMuc: "Ăn uống",
        moTa: "",
        ngay: "",
      });

    } catch (err) {
      console.error("Lỗi thêm giao dịch:", err);
    }

    setLoading(false);
    isSubmitting.current = false;
  };

  const xoa = async (id: number) => {
  const ok = confirm("Bạn có xác nhận xóa không?");
  if (!ok) return;

  await fetch(`http://127.0.0.1:8000/giaodich/${id}`, {
    method: "DELETE",
  });

  setDs(ds.filter((i) => i.id !== id));
};

  const saveEdit = async () => {
  if (!editing) return;

  await fetch(`http://127.0.0.1:8000/giaodich/${editing.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: 1,
      loai: editing.loai,
      so_tien: editing.soTien,
      danh_muc: editing.danhMuc,
      mo_ta: editing.moTa,
      ngay: editing.ngay,
    }),
  });

  // reload lại từ server cho chắc
  const res = await fetch("http://127.0.0.1:8000/giaodich/?user_id=1");
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
      (i.moTa || "").toLowerCase().includes(search.toLowerCase())
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

      <h1 className="text-2xl font-bold text-blue-600">
        Quản lý thu chi
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
          value={form.loai} // ✅ FIX QUAN TRỌNG
          onChange={(e) =>
            setForm({ ...form, loai: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="thu">Thu</option>
          <option value="chi">Chi</option>
        </select>

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
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Đang thêm..." : "+ Thêm"}
        </button>
      </div>

      {/* LIST giữ nguyên */}
      <div className="bg-white rounded-xl shadow p-4 max-h-[450px] overflow-y-auto space-y-3 pr-2">
        {locDs.length === 0 ? (
          <p className="text-gray-400 text-center">
            📭 Chưa có giao dịch
          </p>
        ) : (
          locDs.map((i) => (
            <div key={i.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <span className="px-2 py-1 bg-gray-200 rounded text-sm mr-2">
                  {i.danhMuc}
                </span>
                <span>{i.moTa}</span>
                <p className="text-xs text-gray-400">{i.ngay}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={
                  i.loai === "thu"
                    ? "text-green-600 font-bold"
                    : "text-red-500 font-bold"
                }>
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

      {/* MODAL giữ nguyên */}
      {editing && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl space-y-3 w-80">
      <h2 className="font-bold">Sửa giao dịch</h2>

      {/* LOẠI */}
      <select
        value={editing.loai}
        onChange={(e) =>
          setEditing({ ...editing, loai: e.target.value as "thu" | "chi" })
        }
        className="border p-2 w-full rounded"
      >
        <option value="thu">Thu</option>
        <option value="chi">Chi</option>
      </select>

      {/* DANH MỤC */}
      <select
        value={editing.danhMuc}
        onChange={(e) =>
          setEditing({ ...editing, danhMuc: e.target.value })
        }
        className="border p-2 w-full rounded"
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

      {/* SỐ TIỀN */}
      <input
        value={editing.soTien}
        onChange={(e) =>
          setEditing({
            ...editing,
            soTien: Number(e.target.value.replace(/\D/g, "")),
          })
        }
        className="border p-2 w-full"
        placeholder="Số tiền"
      />

      {/* GHI CHÚ */}
      <input
        value={editing.moTa || ""}
        onChange={(e) =>
          setEditing({ ...editing, moTa: e.target.value })
        }
        className="border p-2 w-full"
        placeholder="Ghi chú"
      />

      {/* NÚT */}
      <button
        onClick={saveEdit}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Lưu
      </button>
    </div>
  </div>
)}
    </div>
  );
}