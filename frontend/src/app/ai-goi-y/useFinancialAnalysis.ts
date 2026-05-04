"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://127.0.0.1:8000";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Insight {
  type: "warning" | "suggestion" | "praise";
  priority: "urgent" | "medium" | "low";
  title: string;
  description: string;
}

export interface CategoryStat {
  name: string;
  amount: number;
}

export interface BudgetAlert {
  category: string;
  used: number;
  limit: number;
  percent: number;
}

export interface GoalAlert {
  name: string;
  target: number;
  achieved: number;
  progress_pct: number;
  days_left: number | null;
}

export interface AnalysisData {
  health_score: number;
  health_label: string;
  current_month: string;
  total_income: number;
  total_expense: number;
  balance: number;
  saving_rate: number;
  top_categories: CategoryStat[];
  budget_alerts: BudgetAlert[];
  goal_alerts: GoalAlert[];
  insights: Insight[];
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useFinancialAnalysis(userId: number) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "Xin chào! Tôi là FinBot 🤖 — trợ lý tài chính AI của bạn. Tôi đã phân tích dữ liệu tài chính của bạn. Hãy hỏi tôi bất cứ điều gì!",
      timestamp: new Date(),
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  /** Fetch financial analysis from backend */
  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/ai/analyze?user_id=${userId}`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu phân tích");
      const json: AnalysisData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /** Send a chat message to AI */
  const sendMessage = useCallback(
    async (message: string) => {
      const userMsg: ChatMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setChatLoading(true);

      try {
        const res = await fetch(`${API_BASE}/ai/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, message }),
        });
        const json = await res.json();
        const aiMsg: ChatMessage = {
          role: "ai",
          content: json.reply ?? "Xin lỗi, tôi không thể trả lời lúc này.",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } catch {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "⚠️ Lỗi kết nối. Vui lòng thử lại.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return {
    data,
    loading,
    error,
    chatMessages,
    chatLoading,
    sendMessage,
    refresh: fetchAnalysis,
  };
}
