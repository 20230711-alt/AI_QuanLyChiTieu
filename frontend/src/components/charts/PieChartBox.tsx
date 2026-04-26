"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];

// ✅ FORMAT TIỀN
const formatVND = (value: number) => {
  return value.toLocaleString("vi-VN") + "đ";
};

export default function PieChartBox({ data }: any) {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}

            // 🔥 FIX CHÍNH Ở ĐÂY
            label={({ value }) => formatVND(value)}
          >
            {data.map((_: any, index: number) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          {/* 🔥 FIX TOOLTIP */}
          <Tooltip formatter={(value) => formatVND(value as number)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}