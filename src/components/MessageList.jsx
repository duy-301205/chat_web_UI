import React, { useRef, useEffect, useState } from "react";

export default function MessageList({
  messages,
  members, // Danh sách thành viên để lấy Avatar và Nickname
  onStartEdit,
  onRecallMessage,
  isPartnerTyping,
}) {
  const currentUserId = Number(localStorage.getItem("userId"));

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // 1. TỰ ĐỘNG CUỘN HOẶC HIỆN NÚT KHI CÓ TIN NHẮN MỚI
  useEffect(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 300;

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowScrollBtn(false);
    } else {
      setShowScrollBtn(true);
    }
  }, [messages]);

  // 2. THEO DÕI CUỘN CHUỘT
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    if (isAtBottom) {
      setShowScrollBtn(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBtn(false);
  };

  const formatMessageGroupDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) return "Hôm nay";
    if (messageDate.toDateString() === yesterday.toDateString())
      return "Hôm qua";
    return messageDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // 🎯 THU THẬP AVATAR ĐÃ XEM (MESSENGER STYLE):
  const getSeenAvatarsForMessage = (messageId) => {
    if (!members || members.length === 0) return [];

    return members.filter((member) => {
      // Bỏ qua chính mình
      if (Number(member.userId) === currentUserId) return false;

      const lastSeenId = member.lastSeenMessageId || member.lastMessageSeenId;
      return Number(lastSeenId) === Number(messageId);
    });
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-[#fdfbf7]/50 relative"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>

      {/* NÚT TIN NHẮN MỚI */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#a8d5ba] text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-white/40 flex items-center gap-1.5 hover:bg-[#97c4a9] active:scale-95 transition-all animate-bounce cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_downward
          </span>
          Tin nhắn mới nhất
        </button>
      )}

      {messages.map((message, index) => {
        const isMine = Number(message.senderId) === currentUserId;
        const currentMsgDate = new Date(message.createdAt).toDateString();
        const prevMsgDate =
          index > 0
            ? new Date(messages[index - 1].createdAt).toDateString()
            : null;
        const showDateLabel = currentMsgDate !== prevMsgDate;

        // Quét lấy danh sách những người đang dừng chân xem ở tin nhắn này
        const seenUsers = getSeenAvatarsForMessage(message.id);

        const memberInfo = members?.find(
          (m) => Number(m.userId) === Number(message.senderId),
        );
        const displayName =
          memberInfo?.nickname ||
          memberInfo?.username ||
          message.senderName ||
          "Thành viên";

        return (
          <React.Fragment key={message.id}>
            {showDateLabel && (
              <div className="flex justify-center my-2 animate-in fade-in duration-200">
                <span className="px-3 py-0.5 rounded-full bg-[#f0eee8]/60 text-[11px] text-[#434840] font-medium">
                  {formatMessageGroupDate(message.createdAt)}
                </span>
              </div>
            )}

            {message.type === "SYSTEM" || !message.senderId ? (
              <div className="flex justify-center my-2.5 animate-in fade-in duration-300 w-full">
                <div
                  id={`msg-${message.id}`}
                  className="px-3 py-0.5 rounded-full bg-[#f0eee8]/60 border border-[#c3c8bd]/20 text-[11px] text-[#434840]/70 flex items-center gap-1.5 shadow-sm transition-all duration-300 origin-center"
                >
                  <span className="italic font-medium">{message.content}</span>
                  <span className="text-[10px] text-[#434840]/60 font-normal border-l border-[#434840]/20 pl-1.5 ml-0.5">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div
                key={`group-${message.id}`}
                className={`flex flex-col gap-1 w-full ${isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`flex items-end gap-2.5 max-w-[75%] group/msg relative ${isMine ? "flex-row-reverse" : ""}`}
                >
                  {!isMine && (
                    <img
                      alt=""
                      className="w-7 h-7 rounded-full object-cover mb-0.5 shrink-0"
                      src={message.senderAvatar || "https://i.pravatar.cc/100"}
                    />
                  )}

                  <div
                    className={`flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}
                  >
                    {!isMine && (
                      <span className="text-[11px] text-[#434840]/70 ml-1">
                        {displayName}
                      </span>
                    )}
                    <div
                      className={`flex items-center gap-1.5 ${isMine ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        id={`msg-${message.id}`}
                        className={`rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.02)] px-3 py-2 transition-all duration-300 origin-center ${
                          isMine
                            ? "bg-[#a8d5ba] rounded-br-[4px]"
                            : "bg-white rounded-bl-[4px] border border-black/5"
                        }`}
                      >
                        <p className="text-[14px] text-[#1c1c18] leading-normal">
                          {message.isDeleted ||
                          message.content === "Tin nhắn đã bị xóa"
                            ? "Tin nhắn đã bị xóa"
                            : message.content}
                        </p>
                        {message.isEdited &&
                          !(
                            message.isDeleted ||
                            message.content === "Tin nhắn đã bị xóa"
                          ) && (
                            <span className="text-[10px] text-[#434840]/50 italic block text-right mt-0.5">
                              Đã chỉnh sửa
                            </span>
                          )}
                      </div>

                      {isMine &&
                        !(
                          message.isDeleted ||
                          message.content === "Tin nhắn đã bị xóa"
                        ) && (
                          <div className="opacity-0 group-hover/msg:opacity-100 flex items-center gap-1 transition-opacity bg-white/80 backdrop-blur-sm shadow-sm border border-black/5 rounded-full px-1.5 py-0.5 h-6 mx-1">
                            <button
                              onClick={() => onStartEdit(message)}
                              title="Chỉnh sửa"
                              className="text-[#434840]/60 hover:text-[#a8d5ba] p-0.5 rounded transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs font-light">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => onRecallMessage(message.id)}
                              title="Thu hồi"
                              className="text-[#434840]/60 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs font-light">
                                history
                              </span>
                            </button>
                          </div>
                        )}

                      <span className="text-[10px] text-[#434840]/50 shrink-0 mb-0.5">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 🎯 GIAO DIỆN AVATAR ĐÃ XEM REALTIME (MESSENGER STYLE) */}
                {seenUsers.length > 0 && (
                  <div
                    className={`flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95 duration-200 ${isMine ? "mr-1" : "ml-9"}`}
                  >
                    {seenUsers.map((u) => (
                      <img
                        key={u.userId}
                        src={u.avatarUrl || "https://i.pravatar.cc/100"}
                        alt={u.nickname || u.username}
                        title={`${u.nickname || u.username} đã xem`}
                        className="w-3.5 h-3.5 rounded-full object-cover border border-white shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {isPartnerTyping && (
        <div className="flex flex-col gap-1 max-w-[75%] animate-in fade-in slide-in-from-bottom-2 duration-200 self-start">
          <span className="text-[11px] text-[#434840]/60 ml-1 italic">
            {isPartnerTyping} đang nhập...
          </span>
          <div className="rounded-[14px] bg-white rounded-bl-[4px] border border-black/5 px-3 py-2 shadow-sm w-fit">
            <div className="flex items-center gap-1 h-3 px-1">
              <span className="w-1.5 h-1.5 bg-[#434840]/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              {/* ĐÃ SỬA: Dọn dẹp sạch sẽ ký tự ]. viết lỗi cú pháp cũ */}
              <span className="w-1.5 h-1.5 bg-[#434840]/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-[#434840]/50 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
