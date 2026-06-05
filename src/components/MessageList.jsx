import React, { useRef, useEffect, useState } from "react"; // Đã thêm useState

export default function MessageList({
  messages,
  onStartEdit,
  onRecallMessage,
  isPartnerTyping, // 🎯 Đã đồng bộ nhận String tên người dùng
}) {
  const currentUserId = Number(localStorage.getItem("userId"));

  // Tạo một điểm neo (Ref) ở đáy danh sách chat và Ref quản lý khung cuộn
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Trạng thái hiển thị nút "Cuộn xuống tin nhắn mới"
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // 1. CHỨC NĂNG TỰ ĐỘNG CUỘN HOẶC HIỆN NÚT KHI CÓ TIN NHẮN MỚI
  useEffect(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Kiểm tra xem người dùng có đang ở sát đáy chat không (cách đáy dưới 300px)
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 300;

    if (isAtBottom) {
      // Nếu đang ở sát đáy, tự động cuộn xuống mượt mà luôn
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowScrollBtn(false);
    } else {
      // Nếu người dùng đang kéo lên tít trên đọc tin nhắn cũ, hiện nút thông báo tin nhắn mới
      setShowScrollBtn(true);
    }
  }, [messages]); // Chạy mỗi khi mảng messages thay đổi (có tin nhắn mới hoặc thu hồi/sửa)

  // 2. THEO DÕI HÀNH VI CUỘN CHUỘT CỦA NGƯỜI DÙNG ĐỂ ẨN/HIỆN NÚT
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Nếu người dùng chủ động tự kéo chuột xuống sát đáy, ẩn nút đi
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    if (isAtBottom) {
      setShowScrollBtn(false);
    }
  };

  // 3. HÀM XỬ LÝ KHI CLICK VÀO NÚT TIN NHẮN MỚI
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

  return (
    <div
      ref={containerRef} // Gắn ref quản lý khung cuộn
      onScroll={handleScroll} // Lắng nghe sự kiện cuộn chuột
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-[#fdfbf7]/50 relative" // Thêm relative để ghim nút định vị float
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Ẩn con lăn của Chrome/Safari */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* --- GIAO DIỆN NÚT TIN NHẮN MỚI (FLOAT BUTTON) --- */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#a8d5ba] text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-white/40 flex items-center gap-1.5 hover:bg-[#97c4a9] active:scale-95 transition-all animate-bounce"
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
                className={`flex items-end gap-2.5 max-w-[75%] group/msg relative ${isMine ? "self-end flex-row-reverse" : ""}`}
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
                      {message.senderName}
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
                            className="text-[#434840]/60 hover:text-[#a8d5ba] p-0.5 rounded transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs font-light">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => onRecallMessage(message.id)}
                            title="Thu hồi"
                            className="text-[#434840]/60 hover:text-red-500 p-0.5 rounded transition-colors"
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
