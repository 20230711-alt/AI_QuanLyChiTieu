"use client";

import { useState, useRef, useEffect } from "react";
import { useFinancialAnalysis, ChatMessage } from "./useFinancialAnalysis";
import { 
  Brain, Sparkles, AlertTriangle, Target, MessageSquare, 
  Send, User, Bot, Loader2, TrendingUp, TrendingDown,
  CheckCircle2, AlertCircle, Info, Activity
} from "lucide-react";

export default function AIGoiYPage() {
  // Tạm thời hardcode user_id = 1 giống các trang khác
  const { 
    data, 
    loading, 
    error, 
    chatMessages, 
    chatLoading, 
    sendMessage 
  } = useFinancialAnalysis(1);

  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTien = (so: number) => so.toLocaleString("vi-VN");

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || chatLoading) return;
    sendMessage(inputMsg);
    setInputMsg("");
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center space-x-3 text-blue-600">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-xl font-medium">FinBot đang phân tích dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl shadow-sm text-center max-w-md">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-lg font-bold mb-2">Đã xảy ra lỗi</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-3 rounded-xl shadow-lg shadow-blue-500/30">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            AI Gợi ý thông minh
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            FinBot phân tích dữ liệu tháng {data.current_month}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CỘT TRÁI: Phân tích & Insight (Chiếm 7 phần) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tổng quan Điểm Sức khỏe */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Sức khỏe tài chính
                </h2>
                <div className="flex items-end gap-3 mt-4">
                  <span className={`text-6xl font-black tracking-tighter ${
                    data.health_score >= 75 ? "text-green-500" :
                    data.health_score >= 50 ? "text-amber-500" : "text-red-500"
                  }`}>
                    {data.health_score}
                  </span>
                  <span className="text-xl text-gray-400 font-medium pb-2">/100</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-50 border">
                  {data.health_score >= 75 ? (
                    <><CheckCircle2 className="h-4 w-4 text-green-500"/> <span className="text-green-700">{data.health_label}</span></>
                  ) : data.health_score >= 50 ? (
                    <><Info className="h-4 w-4 text-amber-500"/> <span className="text-amber-700">{data.health_label}</span></>
                  ) : (
                    <><AlertTriangle className="h-4 w-4 text-red-500"/> <span className="text-red-700">{data.health_label}</span></>
                  )}
                </div>
              </div>
              
              {/* Tóm tắt nhanh */}
              <div className="space-y-4 text-right">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Số dư hiện tại</p>
                  <p className={`text-xl font-bold ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.balance > 0 ? "+" : ""}{formatTien(data.balance)} đ
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tỷ lệ tiết kiệm</p>
                  <p className="text-xl font-bold text-blue-600">{data.saving_rate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lời khuyên & Cảnh báo (Insights) */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="h-6 w-6 text-indigo-500" />
              Insight & Hành động
            </h3>
            
            {data.insights.length === 0 ? (
              <div className="bg-gray-50 border border-dashed rounded-2xl p-8 text-center text-gray-500">
                Chưa có dữ liệu để phân tích trong tháng này.
              </div>
            ) : (
              <div className="grid gap-4">
                {data.insights.map((insight, idx) => {
                  let bgColor = "bg-white";
                  let borderColor = "border-gray-100";
                  let icon = <Info className="h-6 w-6 text-blue-500" />;
                  let titleColor = "text-gray-800";

                  if (insight.type === "warning") {
                    bgColor = insight.priority === "urgent" ? "bg-red-50/50" : "bg-amber-50/50";
                    borderColor = insight.priority === "urgent" ? "border-red-200" : "border-amber-200";
                    icon = <AlertCircle className={`h-6 w-6 ${insight.priority === "urgent" ? 'text-red-500' : 'text-amber-500'}`} />;
                    titleColor = insight.priority === "urgent" ? "text-red-800" : "text-amber-800";
                  } else if (insight.type === "suggestion") {
                    bgColor = "bg-indigo-50/30";
                    borderColor = "border-indigo-100";
                    icon = <Sparkles className="h-6 w-6 text-indigo-500" />;
                    titleColor = "text-indigo-900";
                  } else if (insight.type === "praise") {
                    bgColor = "bg-green-50/50";
                    borderColor = "border-green-200";
                    icon = <CheckCircle2 className="h-6 w-6 text-green-500" />;
                    titleColor = "text-green-800";
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`${bgColor} border ${borderColor} rounded-2xl p-5 flex gap-4 transition-all hover:shadow-md hover:-translate-y-0.5`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {icon}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${titleColor} mb-1`}>{insight.title}</h4>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: Trợ lý Chat AI (Chiếm 5 phần) */}
        <div className="lg:col-span-5 flex flex-col h-[75vh]">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            
            {/* Header Chat */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight">FinBot</h3>
                <p className="text-blue-100 text-xs flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  Trực tuyến
                </p>
              </div>
            </div>

            {/* Khung Chat */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className="flex-shrink-0 mt-auto mb-1">
                    {msg.role === "ai" ? (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-indigo-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div 
                    className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white border border-gray-100 text-gray-700 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-auto mb-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Khung Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form 
                onSubmit={handleSendChat}
                className="flex items-center gap-2 bg-gray-100 rounded-full p-1.5 pr-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all"
              >
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Hỏi FinBot về chi tiêu của bạn..."
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-gray-700"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim() || chatLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors"
                >
                  <Send className="h-5 w-5 ml-0.5" />
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
