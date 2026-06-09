import React, { useRef, useEffect } from "react";
import { sendWSMessage } from "../api/webSocketService";

export default function ChatInput({
  inputText,
  setInputText,
  editingMessageId,
  setEditingMessageId,
  onSendMessage,
  activeChatId,
  currentUserId,
}) {
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      sendTypingStatus(false);

      onSendMessage();
    }
  };

  const sendTypingStatus = (isTyping) => {
    if (!activeChatId || !currentUserId) return;

    isTypingRef.current = isTyping;

    sendWSMessage("/app/chat.typing", {
      conversationId: Number(activeChatId),
      userId: currentUserId,
      isTyping: isTyping,
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);

    if (editingMessageId) return;

    if (value.trim().length > 0) {
      if (!isTypingRef.current) {
        sendTypingStatus(true);
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(false);
      }, 3000);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (isTypingRef.current) {
        sendTypingStatus(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (isTypingRef.current) {
        sendTypingStatus(false);
      }
    };
  }, [activeChatId]);

  return (
    <div className="p-3 bg-white/80 border-t border-[#c3c8bd]/10 backdrop-blur-md flex flex-col gap-1.5">
      {editingMessageId && (
        <div className="flex items-center justify-between px-3 py-1 bg-[#a8d5ba]/10 rounded-lg text-xs text-[#434840] shrink-0 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#a8d5ba]">
              edit
            </span>
            <span>Đang chỉnh sửa tin nhắn...</span>
          </div>
          <button
            onClick={() => {
              setEditingMessageId(null);
              setInputText("");
            }}
            className="text-[10px] underline hover:text-red-500 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
        </div>
      )}

      <div className="w-full bg-white rounded-full p-1.5 flex items-center gap-1.5 border border-[#c3c8bd]/30 shadow-sm">
        <input
          className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] placeholder:text-[#434840]/50 px-3 h-8 outline-none"
          placeholder={
            editingMessageId
              ? "Nhập nội dung mới cần thay đổi..."
              : "Nhập tin nhắn..."
          }
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center gap-0.5 text-[#434840]/70 px-1">
          <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0eee8] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">
              sentiment_satisfied
            </span>
          </button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0eee8] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">
              attach_file
            </span>
          </button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0eee8] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">image</span>
          </button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0eee8] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">
              gif_box
            </span>
          </button>
        </div>
        <button
          onClick={() => {
            if (typingTimeoutRef.current)
              clearTimeout(typingTimeoutRef.current);
            sendTypingStatus(false);
            onSendMessage();
          }}
          disabled={!inputText.trim()}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 text-white ${
            inputText.trim()
              ? "bg-[#a8d5ba] shadow-md scale-105 active:scale-95 cursor-pointer"
              : "bg-[#b0e0f6]/50 opacity-60 cursor-not-allowed"
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {editingMessageId ? "check" : "send"}
          </span>
        </button>
      </div>
    </div>
  );
}
