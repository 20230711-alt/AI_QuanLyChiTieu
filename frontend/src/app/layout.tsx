"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState("");

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    const r = localStorage.getItem("role");

    if (r) setRole(r);

    //  chưa login thì về trang đăng nhập
    if (!isLogin && pathname !== "/dangnhap" && pathname !== "/dangky") {
      router.push("/dangnhap");
    }
  }, [pathname, router]);

  const isAuthPage = pathname === "/dangnhap" || pathname === "/dangky";

  return (
    <html lang="vi">
      <body className="bg-gray-900 text-white">
        {isAuthPage ? (
          <div>{children}</div>
        ) : (
          <div className="flex min-h-screen">

            {/* ===== SIDEBAR ===== */}
            <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-400 via-purple-500 to-indigo-500 p-5 shadow-2xl flex flex-col">
              
              {/* Logo */}
              <h1 className="text-lg font-bold mb-6 flex items-center gap-2 whitespace-nowrap">
                💰 <span>AI quản lý chi tiêu</span>
              </h1>

              {/* ===== MENU ===== */}
              <nav className="space-y-2 text-[14px]">

                <div onClick={() => router.push("/")}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap">
                   Trang chủ
                </div>

                <div onClick={() => router.push("/quan-ly-thu-chi")}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap">
                   Quản lý thu chi
                </div>

                <div onClick={() => router.push("/quan-ly-ngan-sach")}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap">
                   Quản lý ngân sách
                </div>

                <div onClick={() => router.push("/quan-ly-muc-tieu")}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap">
                   Quản lý mục tiêu
                </div>

                <div onClick={() => router.push("/quan-ly-thong-ke")}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap">
                   Quản lý thống kê
                </div>

                <div onClick={() => router.push("/ai-goi-y")}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap">
                   AI gợi ý thông minh
                </div>

                <div onClick={() => router.push("/quan-ly-nhac-nho")}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap">
                   Quản lý nhắc nhở
                </div>

                <div onClick={() => router.push("/tai-khoan")}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap">
                   👤 Tài khoản của tôi
                </div>

                {/*  CHỈ ADMIN MỚI THẤY */}
                {role === "admin" && (
                  <div
                    onClick={() => router.push("/quan-ly-user")}
                    className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition whitespace-nowrap"
                  >
                    👤 Quản lý người dùng
                  </div>
                )}

              </nav>

              {/* ===== LOGOUT ===== */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    localStorage.removeItem("isLogin");
                    localStorage.removeItem("role");
                    router.push("/dangnhap");
                  }}
                  className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 hover:opacity-90 py-2.5 rounded-xl font-semibold shadow-md transition"
                >
                  Đăng xuất
                </button>
              </div>

            </aside>

            {/* ===== MAIN ===== */}
            <main className="flex-1 p-6 bg-gradient-to-br from-[#f3ecff] to-[#dbeafe] text-black">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}