-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 27, 2026 lúc 06:51 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ai_chitieu`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giao_dich`
--

CREATE TABLE `giao_dich` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `loai` varchar(10) DEFAULT NULL,
  `so_tien` int(11) DEFAULT NULL,
  `danh_muc` varchar(50) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `giao_dich`
--

INSERT INTO `giao_dich` (`id`, `user_id`, `loai`, `so_tien`, `danh_muc`, `mo_ta`, `ngay`, `created_at`) VALUES
(1, 1, 'thu', 10000000, 'Lương', 'Lương tháng', '2026-04-01', '2026-04-12 22:51:03'),
(2, 1, 'chi', 2000000, 'Ăn uống', 'Ăn nhà hàng', '2026-04-02', '2026-04-12 22:51:03'),
(3, 1, 'chi', 1000000, 'Đi lại', 'hahaha', '2026-04-15', '2026-04-12 23:35:24'),
(4, 1, 'chi', 10000, 'Ăn uống', '', '2026-04-12', '2026-04-13 00:12:15'),
(5, 1, 'thu', 10000000, 'Lương', 'Lương tháng 4', '2026-04-01', '2026-04-22 15:12:34'),
(6, 1, 'thu', 2000000, 'Freelance', 'Làm thêm', '2026-04-10', '2026-04-22 15:12:34'),
(7, 1, 'chi', 500000, 'Ăn uống', 'Ăn sáng', '2026-04-02', '2026-04-22 15:12:34'),
(8, 1, 'chi', 1500000, 'Ăn uống', 'Ăn nhà hàng', '2026-04-05', '2026-04-22 15:12:34'),
(9, 1, 'chi', 800000, 'Mua sắm', 'Quần áo', '2026-04-08', '2026-04-22 15:12:34'),
(10, 1, 'chi', 300000, 'Đi lại', 'Xăng xe', '2026-04-09', '2026-04-22 15:12:34'),
(11, 1, 'chi', 1200000, 'Mua sắm', 'Shopee', '2026-04-12', '2026-04-22 15:12:34'),
(12, 1, 'chi', 200000, 'Ăn uống', 'Cafe', '2026-04-15', '2026-04-22 15:12:34'),
(13, 1, 'chi', 400000, 'Đi lại', 'Grab', '2026-04-18', '2026-04-22 15:12:34'),
(14, 1, 'chi', 600000, 'Giải trí', 'Xem phim', '2026-04-20', '2026-04-22 15:12:34'),
(15, 1, 'chi', 500000, 'Sinh hoạt', 'Đóng tiền điện', '2026-04-30', '2026-04-24 14:19:42'),
(31, 1, 'chi', 1000000, 'Tiền lương', '', '2026-04-26', '2026-04-26 23:41:30'),
(32, 1, 'chi', 200000, 'Khác', 'Về quê', '2026-04-26', '2026-04-26 23:44:22'),
(36, 1, 'chi', 10000, 'Khác', '', '2026-04-27', '2026-04-27 21:38:21'),
(37, 1, 'thu', 200000, 'Sức khỏe', '', '2026-04-27', '2026-04-27 21:48:31'),
(38, 1, 'chi', 100000, 'Học tập', '', '2026-04-27', '2026-04-27 21:48:47'),
(39, 1, 'chi', 1000, 'Đi lại', '', '2026-04-27', '2026-04-27 21:54:37'),
(40, 1, 'thu', 2000, 'Học Tập', '', '2026-04-27', '2026-04-27 22:09:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `muc_tieu`
--

CREATE TABLE `muc_tieu` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ten` varchar(100) DEFAULT NULL,
  `muc_tieu` int(11) DEFAULT NULL,
  `da_dat` int(11) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `muc_tieu`
--

INSERT INTO `muc_tieu` (`id`, `user_id`, `ten`, `muc_tieu`, `da_dat`, `deadline`, `created_at`) VALUES
(3, 1, 'Du lịch Nhật', 20000000, 5000000, '2026-09-01', '2026-04-21 13:42:00'),
(4, 1, 'Mua laptop', 30000000, 30000000, '2026-06-01', '2026-04-21 13:42:00'),
(5, 1, 'Quỹ dự phòng', 10000000, 2000000, '2026-08-01', '2026-04-21 13:42:00'),
(6, 1, 'Học tiếng Anh', 15000000, 7000000, '2026-07-15', '2026-04-21 13:42:00'),
(7, 1, 'Về quê', 5000000, 2001, '2026-06-01', '2026-04-21 08:06:43'),
(8, 1, 'Nhậu', 500, 0, '2026-04-22', '2026-04-21 08:11:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ngan_sach`
--

CREATE TABLE `ngan_sach` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `danh_muc` varchar(50) DEFAULT NULL,
  `gioi_han` int(11) DEFAULT NULL,
  `thang` varchar(7) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `da_dung` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ngan_sach`
--

INSERT INTO `ngan_sach` (`id`, `user_id`, `danh_muc`, `gioi_han`, `thang`, `created_at`, `da_dung`) VALUES
(1, 1, 'Ăn uống', 3000000, '2026-04', '2026-04-12 22:51:10', 4211000),
(2, 1, 'Mua sắm', 2000000, '2026-04', '2026-04-12 22:51:10', 2000000),
(3, 1, 'Du lịch', 1000000, '2026-04', '2026-04-20 22:10:06', 0),
(4, 1, 'Đi lại', 1000000, '2026-04', '2026-04-20 22:35:02', 1800000),
(5, 1, 'Khác', 100000, '2026-04', '2026-04-26 23:09:36', 2210000),
(6, 1, 'tiền lương', 0, '2026-04', '2026-04-26 23:41:30', 3000000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhac_nho`
--

CREATE TABLE `nhac_nho` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `noi_dung` varchar(255) DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `lap_lai` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `da_hoan_thanh` tinyint(1) DEFAULT 0,
  `so_tien` int(11) DEFAULT NULL,
  `loai` varchar(10) DEFAULT 'chi',
  `danh_muc` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhac_nho`
--

INSERT INTO `nhac_nho` (`id`, `user_id`, `noi_dung`, `ngay`, `lap_lai`, `created_at`, `da_hoan_thanh`, `so_tien`, `loai`, `danh_muc`) VALUES
(2, 1, 'Đóng tiền điện', '2026-04-30', 1, '2026-04-24 13:52:35', 1, 500000, 'chi', 'Sinh hoạt'),
(7, 1, 'Đóng học phí', '2026-05-10', 0, '2026-04-24 13:52:35', 0, 2000000, 'chi', 'Giáo dục'),
(11, 1, 'Khám sức khỏe định kỳ', '2026-05-01', 1, '2026-04-24 13:52:35', 0, 300000, 'chi', 'Y tế'),
(12, 1, 'Trả tiền internet', '2026-05-05', 1, '2026-04-27 22:33:08', 0, 300000, 'chi', 'Sinh hoạt'),
(13, 1, 'Nộp tiền điện', '2026-05-08', 1, '2026-04-27 22:33:08', 0, 450000, 'chi', 'Sinh hoạt'),
(14, 1, 'Đóng bảo hiểm', '2026-05-15', 0, '2026-04-27 22:33:08', 0, 1200000, 'chi', 'Y tế'),
(15, 1, 'Nhận lương tháng 5', '2026-05-28', 1, '2026-04-27 22:33:08', 0, 10000000, 'thu', 'Tiền lương'),
(16, 1, 'Đóng tiền phòng', '2026-05-01', 1, '2026-04-27 22:33:08', 1, 2000000, 'chi', 'Sinh hoạt'),
(17, 1, 'Trả nợ cho mẹ', '2026-04-27', 1, '2026-04-27 15:35:20', 0, 0, 'chi', 'Khác');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thong_ke`
--

CREATE TABLE `thong_ke` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `thang` varchar(7) DEFAULT NULL,
  `tong_thu` float DEFAULT NULL,
  `tong_chi` float DEFAULT NULL,
  `so_du` float DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thong_ke`
--

INSERT INTO `thong_ke` (`id`, `user_id`, `thang`, `tong_thu`, `tong_chi`, `so_du`, `created_at`) VALUES
(1, 1, '2026-04', 22202000, 9821000, 12381000, '2026-04-27 16:46:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'user',
  `sdt` varchar(20) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `sdt`, `dia_chi`) VALUES
(1, 'ly', 'linh@gmail.com', '123456', 'admin', '0912345678', 'Hà Nội'),
(2, 'nam', 'nam@gmail.com', '123456', 'admin', '0987654327', 'TP.HCM'),
(6, 'nguyệt', '', '123456', 'user', '0356123456', 'Cần Thơ'),
(7, 'user3', NULL, '123456', 'user', '0333123456', 'Huế'),
(9, 'user5', NULL, '123456', 'user', '0321123456', 'Bình Dương'),
(10, 'test1', NULL, '123456', 'user', '0388123456', 'Đồng Nai'),
(11, 'test2', NULL, '123456', 'user', '0369123456', 'Quảng Ninh'),
(12, 'guest', NULL, '123456', 'user', '0399123456', 'Nha Trang'),
(13, 'kiên', NULL, '123456', 'user', '0345123456', 'Vũng Tàu'),
(14, 'lan', NULL, '123456', 'user', '0377123456', 'Long An'),
(15, 'hi', 'hi@gmail.com', '123456', 'user', NULL, NULL),
(16, 'ha', 'ha@gmail.com', '123456', 'user', '0338561469', 'Hà Tĩnh'),
(17, 'abc', 'abc@gmail.com', '123456', 'user', '03648264763', 'Nam Định'),
(18, 'didi', 'h@gmail.com', '123456', 'user', '047563875643', 'Nam Định'),
(19, 'long', 'long@gmail.com', '123456', 'admin', '0353246754', 'Hà Tĩnh');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `giao_dich`
--
ALTER TABLE `giao_dich`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `muc_tieu`
--
ALTER TABLE `muc_tieu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `ngan_sach`
--
ALTER TABLE `ngan_sach`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `nhac_nho`
--
ALTER TABLE `nhac_nho`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `thong_ke`
--
ALTER TABLE `thong_ke`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_thong_ke_id` (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_email` (`email`),
  ADD KEY `ix_users_id` (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `giao_dich`
--
ALTER TABLE `giao_dich`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `muc_tieu`
--
ALTER TABLE `muc_tieu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `ngan_sach`
--
ALTER TABLE `ngan_sach`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `nhac_nho`
--
ALTER TABLE `nhac_nho`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `thong_ke`
--
ALTER TABLE `thong_ke`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `giao_dich`
--
ALTER TABLE `giao_dich`
  ADD CONSTRAINT `giao_dich_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `muc_tieu`
--
ALTER TABLE `muc_tieu`
  ADD CONSTRAINT `muc_tieu_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `ngan_sach`
--
ALTER TABLE `ngan_sach`
  ADD CONSTRAINT `ngan_sach_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `nhac_nho`
--
ALTER TABLE `nhac_nho`
  ADD CONSTRAINT `nhac_nho_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
