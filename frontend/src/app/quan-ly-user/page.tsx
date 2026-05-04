"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function QuanLyUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("user");

  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("user");

  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const fetchUsers = async () => {
    try {
      const role = localStorage.getItem("role");

      const res = await axios.get(
        `http://127.0.0.1:8000/admin/users?role=${role}`
      );

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.log("Lỗi API:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    //  CHẶN USER
    if (role !== "admin") {
      alert("❌ Bạn không có quyền truy cập!");
      window.location.href = "/";
      return;
    }

    fetchUsers();
  }, []);

  const deleteUser = async (id: number) => {
    const ok = confirm("Bạn có xác nhận xóa người dùng không?");
    if (!ok) return;

    try {
      const role = localStorage.getItem("role"); 

      await axios.delete(
        `http://127.0.0.1:8000/admin/users/${id}`,
        {
          params: { role }, 
        }
      );

      fetchUsers();
      showNotification("✅ Xóa người dùng thành công!");
    } catch (err) {
      console.log("Lỗi xóa:", err);
    }
  };

  const handleAdd = async () => {
    if (!newUsername || !newEmail || !newPhone || !newAddress) {
      setError("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!newEmail.includes("@")) {
      setError("⚠️ Email không hợp lệ!");
      return;
    }

    if (newPhone.length < 9) {
      setError("⚠️ Số điện thoại không hợp lệ!");
      return;
    }

    try {
      const role = localStorage.getItem("role"); 

      await axios.post(
        "http://127.0.0.1:8000/admin/users",
        {
          username: newUsername,
          email: newEmail,
          password: "123456",
          role: newRole,
          sdt: newPhone,
          dia_chi: newAddress,
        },
        {
          params: { role }, 
        }
      );

      fetchUsers();
      showNotification("✅ Thêm người dùng thành công!");

      setNewUsername("");
      setNewRole("user");
      setNewEmail("");
      setNewPhone("");
      setNewAddress("");
      setError("");
    } catch (err) {
      console.log("Lỗi thêm:", err);
      setError("❌ Thêm thất bại!");
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditEmail(user.email || "");
    setEditPhone(user.sdt || "");
    setEditAddress(user.dia_chi || "");
  };

  const handleSave = async (id: number) => {
    try {
      const role = localStorage.getItem("role"); 

      await axios.put(
        `http://127.0.0.1:8000/admin/users/${id}`,
        {
          username: editUsername,
          email: editEmail,
          role: editRole,
          sdt: editPhone,
          dia_chi: editAddress,
        },
        {
          params: { role }, 
        }
      );

      fetchUsers();
      showNotification("✅ Sửa người dùng thành công!");
      setEditingId(null);
    } catch (err) {
      console.log("Lỗi sửa:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-purple-100 text-black relative">
      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 font-semibold transition-all">
          {notification}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">
        👤 Quản lý người dùng
      </h1>

      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          placeholder="Tên đăng nhập"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className={`px-2 py-1 text-sm rounded border w-32 ${
            !newUsername && error ? "border-red-500" : ""
          }`}
        />

        <input
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className={`px-2 py-1 text-sm rounded border w-40 ${
            !newEmail && error ? "border-red-500" : ""
          }`}
        />

        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="px-2 py-1 text-sm rounded border w-24"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <input
          placeholder="SĐT"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className={`px-2 py-1 text-sm rounded border w-32 ${
            !newPhone && error ? "border-red-500" : ""
          }`}
        />

        <input
          placeholder="Địa chỉ"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className={`px-2 py-1 text-sm rounded border w-40 ${
            !newAddress && error ? "border-red-500" : ""
          }`}
        />

        <button
          onClick={handleAdd}
          className="px-3 py-1 text-sm rounded bg-green-500 text-white"
        >
          Thêm
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow overflow-hidden overflow-x-auto">
        
        <div className="grid grid-cols-[50px_130px_180px_100px_120px_160px_140px] px-4 py-2 bg-gray-200 text-sm font-semibold">
          <div>ID</div>
          <div>Tên đăng nhập</div>
          <div>Email</div>
          <div>Vai trò</div>
          <div>SĐT</div>
          <div>Địa chỉ</div>
          <div>Thao tác</div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {users.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Không có dữ liệu
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[50px_130px_180px_100px_120px_160px_140px] items-center px-4 py-2 text-sm border-b hover:bg-gray-50"
              >
                <div>{user.id}</div>

                <div>
                  {editingId === user.id ? (
                    <input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    />
                  ) : (
                    user.username
                  )}
                </div>

                <div>
                  {editingId === user.id ? (
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    />
                  ) : (
                    user.email
                  )}
                </div>

                <div>
                  {editingId === user.id ? (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-purple-200 text-purple-700"
                        : "bg-gray-200"
                    }`}>
                      {user.role}
                    </span>
                  )}
                </div>

                <div>{editingId === user.id ? (
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  />
                ) : user.sdt}</div>

                <div>{editingId === user.id ? (
                  <input
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  />
                ) : user.dia_chi}</div>

                <div className="flex gap-2">
                  {editingId === user.id ? (
                    <button
                      onClick={() => handleSave(user.id)}
                      className="px-2 py-1 text-sm bg-green-500 text-white rounded"
                    >
                      Lưu
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                    >
                      Sửa
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}