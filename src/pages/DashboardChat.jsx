import React, { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import SidebarChat from "./SidebarChat";
import FindSpirits from "./FindSpirits";
import CreateGroupModal from "./CreateGroupModel";
import AddMemberModal from "./AddMemberModel";
import ViewMembersModal from "./ViewMembersModal";
import {
  globalUsersZone,
  userData,
  initialNotifications,
} from "../data/chatData";

import {
  getConversationsApi,
  getMessagesByConversationApi,
  getConversationMembersApi,
  addConversationMemberApi,
  leaveConversationApi,
  sendMessageApi,
  editMessageApi,
  recallMessageApi,
} from "../api/api";

export default function DashboardChat() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("chat");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isViewMembersOpen, setIsViewMembersOpen] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [members, setMembers] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);

  const pushSystemNotification = (title, desc, icon = "info") => {
    const newNotif = {
      id: Date.now(),
      title: title,
      desc: desc,
      time: "Vừa xong",
      isUnread: true,
      icon: icon,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const result = await getConversationsApi();
        if (result.code === 200) {
          setChatList(result.data || []);
        }
      } catch (error) {
        console.error("Lấy danh sách cuộc trò chuyện thất bại:", error.message);
      }
    };
    fetchConversations();
  }, []);

  const fetchMessages = async () => {
    if (!activeChatId) return;
    try {
      const result = await getMessagesByConversationApi(activeChatId);
      if (result.code === 200) {
        const sortedMessages = [...(result.data.content || [])].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error("Lấy tin nhắn thất bại:", error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId) {
      setMembers([]);
      return;
    }

    const fetchMembers = async () => {
      try {
        const result = await getConversationMembersApi(activeChatId);
        if (result.code === 200) {
          setMembers(result.data || []);
        }
      } catch (error) {
        console.error("Lấy danh sách thành viên thất bại:", error.message);
      }
    };
    fetchMembers();
  }, [activeChatId]);

  const reloadMembers = async () => {
    if (!activeChatId) return;
    try {
      const result = await getConversationMembersApi(activeChatId);
      if (result.code === 200) {
        setMembers(result.data || []);
      }
    } catch (error) {
      console.error(
        "Cập nhật lại danh sách thành viên thất bại:",
        error.message,
      );
    }
  };

  const handleAddMemberSubmit = async (data) => {
    try {
      const result = await addConversationMemberApi(activeChatId, data);
      if (result.code === 200 || result.status === "success" || result) {
        pushSystemNotification(
          "Hội nhóm",
          "Đã thêm thành viên mới thành công. 🌿",
          "group_add",
        );
        await reloadMembers();
        setIsAddMemberOpen(false);
      }
    } catch (error) {
      console.error("Thêm thành viên thất bại:", error.message);
    }
  };

  const handleLeaveGroupSubmit = async () => {
    if (!activeChatId) return;
    try {
      const result = await leaveConversationApi(activeChatId);
      if (result.code === 200 || result) {
        pushSystemNotification(
          "Hội nhóm",
          `Bạn đã rời khỏi nhóm trò chuyện. 🍃`,
          "logout",
        );
        setChatList((prevList) =>
          prevList.filter((chat) => chat.id !== activeChatId),
        );
        setActiveChatId(null);
      }
    } catch (error) {
      console.error("Rời nhóm thất bại:", error.message);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChatId) return;

    if (editingMessageId) {
      try {
        const result = await editMessageApi({
          messageId: editingMessageId,
          content: inputText.trim(),
        });
        if (result) {
          setInputText("");
          setEditingMessageId(null);
          await fetchMessages();
          pushSystemNotification(
            "Tin nhắn",
            "Đã cập nhật nội dung tin nhắn. ✨",
            "edit",
          );
        }
      } catch (error) {
        console.error("Sửa tin nhắn thất bại:", error.message);
      }
      return;
    }

    try {
      const formData = new FormData();
      const messageRequest = {
        conversationId: activeChatId,
        content: inputText.trim(),
      };
      formData.append("data", JSON.stringify(messageRequest));

      const result = await sendMessageApi(formData);
      if (result) {
        setInputText("");
        await fetchMessages();
      }
    } catch (error) {
      console.error("Gửi tin nhắn thất bại:", error.message);
    }
  };

  const startEditMessage = (message) => {
    if (message.isDeleted) return;
    setEditingMessageId(message.id);
    setInputText(message.content);
  };

  const handleRecallMessage = async (messageId) => {
    try {
      const result = await recallMessageApi(messageId);
      if (result) {
        await fetchMessages();
        pushSystemNotification(
          "Tin nhắn",
          "Tin nhắn đã được thu hồi.",
          "history",
        );
      }
    } catch (error) {
      console.error("Thu hồi tin nhắn thất bại:", error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddFriend = (targetUser) => {
    pushSystemNotification(
      "Hệ thống kết bạn",
      `Bạn đã gửi yêu cầu kết bạn đến ${targetUser.name}.`,
      "person_add",
    );
  };

  const filteredChatList = chatList.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "unread") return chat.unread > 0;
    if (activeTab === "group") return chat.type === "GROUP";
    return true;
  });

  const globalSearchCandidates =
    searchQuery.trim() !== ""
      ? globalUsersZone.filter(
          (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !chatList.some((chat) => chat.name === u.name),
        )
      : [];

  const currentActiveChat = chatList.find((chat) => chat.id === activeChatId);

  const formatMessageGroupDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return messageDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const friendsAvailableToAdd = globalUsersZone.filter(
    (friend) =>
      !members.some((member) => {
        const friendId = String(friend.id || friend.userId || "");
        const memberId = String(member.id || member.userId || "");
        return friendId === memberId && friendId !== "";
      }),
  );

  return (
    <div
      className="h-screen w-screen overflow-hidden text-[#1c1c18] font-sans antialiased selection:bg-[#a8d5ba]/20 selection:text-[#1c1c18] bg-cover bg-center bg-fixed p-4 notranslate"
      translate="no"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2AJYahLb7DFTwMwjAGJFiLlmmwwSgPe37jcV82yF8RcTMikB-4qaXk-U_UA3j1R_wYXpMADNCGdXyM8oCK0p1UtWrfrHku8FheYJzfHaDC2gReGUb8FZI_t4P4KK2b67mRZe8EYOt5zWnJFRxTAqlxCa7JX91Yw5PknWCByFRrAP-knBF55Fx1J2oQoWMYIz-oyo7WF2wabntWjZrxDF-Ycxk4saXcHB_WodNoImkJE69V2XYmHyk-9EfyGIylNe0tmc5dL6s0-o')",
      }}
    >
      <div className="flex h-full w-full gap-4 max-w-[1600px] mx-auto relative">
        <SidebarChat
          view={view}
          setView={setView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          globalSearchCandidates={globalSearchCandidates}
          filteredChatList={filteredChatList}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          userData={userData}
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpen={setIsNotificationOpen}
          notifications={notifications}
          handleAddFriend={handleAddFriend}
          setIsCreateGroupOpen={setIsCreateGroupOpen}
        />

        {view === "spirits" ? (
          <FindSpirits onAddFriend={handleAddFriend} />
        ) : view === "profile" ? (
          <MyProfile userData={userData} onBack={() => setView("chat")} />
        ) : view === "garden" ? (
          <main className="flex-1 rounded-3xl bg-[rgba(253,251,247,0.7)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center p-6 z-10">
            <span className="material-symbols-outlined text-6xl text-[#a8d5ba]/60 mb-3">
              potted_plant
            </span>
            <p className="text-xs text-[#434840] italic">
              Khu vườn Garden yên bình đang được nuôi dưỡng... 🍃
            </p>
          </main>
        ) : (
          <>
            <CreateGroupModal
              isOpen={isCreateGroupOpen}
              onClose={() => setIsCreateGroupOpen(false)}
              onGroupCreated={(newGroup) => {
                setChatList((prevChats) => [newGroup, ...prevChats]);
                setActiveChatId(newGroup.id);
                setView("chat");
              }}
            />

            {!activeChatId ? (
              <main className="flex-1 rounded-3xl bg-[rgba(253,251,247,0.7)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center p-6 z-10">
                <span
                  className="material-symbols-outlined text-6xl text-[#a8d5ba]/60 mb-3 animate-bounce"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  spa
                </span>
                <h2 className="text-xl font-bold text-[#1c1c18] mb-1.5">
                  Chào mừng bạn đến với Komorebi Sanctuary!
                </h2>
                <p className="text-xs text-[#434840] max-w-[360px]">
                  Hãy chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
                  chia sẻ câu chuyện cùng các linh hồn rừng xanh nhé. 🌿
                </p>
              </main>
            ) : (
              <>
                <main className="flex-1 rounded-3xl bg-[rgba(253,251,247,0.9)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden relative z-10">
                  <header className="h-[60px] w-full flex items-center justify-between px-4 border-b border-[#c3c8bd]/10 bg-white/50 backdrop-blur-md z-10 shrink-0">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                    >
                      <div className="flex -space-x-2.5">
                        <img
                          alt=""
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbEnfWoJN0FdX8Q0Hq4yE8WQ3NjFAwW0TcMQACprWtM0VqxxbP1Sgw0eTqykmNfDZtFBy5ZvIH7SWwAmyOrrWEZ6SNR5scHsWMxBKtKscaJs0DiDoWB6sFt2FbPH_8rzfVPcOquHc9qOYVx_JaEDZHkEXwuv8Z_pJaZK0Mmat7-6orD3w26bB58PGA5o0wGsPr_7hi6gC5oxa1ObU1SEiwFjt8hNqMPeiirCHzBeMFigp_WK806igADIPMmBDV0oIF-KOC-QfcS0o"
                        />
                        <img
                          alt=""
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHOA6JzXhWkDkkk6txfQ34mARY-BslsFdLmm1Lu5E8mwn97qpLRXwJV6lVomfjtcUGMaWQLcAEJXIwDKhdQFX6SN8soBnkKirRUlSgD95DTGGlJGWenv-1Ir3_aRUXYxlLjMWbxnBM_Fei4TtozkR_eLjl5879HdbmB6qwh-5KAvWRU8YRRIo0j7K1ytBxrKtEH32fWqLYpb4MPHS1K3QFAVgXfDdfk-1PaGZryriCXL22S1gA-5cPbXxPvE0LYWycsCmUYFSHrKg"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-bold text-[#1c1c18]">
                            {currentActiveChat?.name}
                          </h2>
                          <span
                            className="material-symbols-outlined text-[#f9d5c5] text-xs"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        </div>
                        <p className="text-[11px] text-[#434840]">
                          {members.length} Linh hồn tụ họp
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#b0e0f6]">
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#b0e0f6]/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px] font-light">
                          search
                        </span>
                      </button>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#b0e0f6]/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px] font-light">
                          call
                        </span>
                      </button>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#b0e0f6]/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px] font-light">
                          videocam
                        </span>
                      </button>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#434840] hover:bg-[#f0eee8] transition-colors ml-1">
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-[#fdfbf7]/50">
                    {messages.map((message, index) => {
                      const currentUserId = Number(
                        localStorage.getItem("userId"),
                      );
                      const isMine = Number(message.senderId) === currentUserId;
                      const currentMsgDate = new Date(
                        message.createdAt,
                      ).toDateString();
                      const prevMsgDate =
                        index > 0
                          ? new Date(
                              messages[index - 1].createdAt,
                            ).toDateString()
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
                              <div className="px-3 py-0.5 rounded-full bg-[#f0eee8]/60 border border-[#c3c8bd]/20 text-[11px] text-[#434840]/70 flex items-center gap-1.5 shadow-sm">
                                <span className="italic font-medium">
                                  {message.content}
                                </span>
                                <span className="text-[10px] text-[#434840]/60 font-normal border-l border-[#434840]/20 pl-1.5 ml-0.5">
                                  {new Date(
                                    message.createdAt,
                                  ).toLocaleTimeString([], {
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
                                  src={
                                    message.senderAvatar ||
                                    "https://i.pravatar.cc/100"
                                  }
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
                                    className={`rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.02)] px-3 py-2 ${
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
                                          onClick={() =>
                                            startEditMessage(message)
                                          }
                                          title="Chỉnh sửa"
                                          className="text-[#434840]/60 hover:text-[#a8d5ba] p-0.5 rounded transition-colors"
                                        >
                                          <span className="material-symbols-outlined text-xs font-light">
                                            edit
                                          </span>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleRecallMessage(message.id)
                                          }
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
                                    {new Date(
                                      message.createdAt,
                                    ).toLocaleTimeString([], {
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
                  </div>

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
                          className="text-[10px] underline hover:text-red-500 transition-colors"
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
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <div className="flex items-center gap-0.5 text-[#434840]/70 px-1">
                        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0eee8] transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            sentiment_satisfied
                          </span>
                        </button>
                        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0eee8] transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            attach_file
                          </span>
                        </button>
                        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0eee8] transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            image
                          </span>
                        </button>
                        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0eee8] transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            gif_box
                          </span>
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
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
                </main>

                {isRightSidebarOpen && (
                  <aside className="w-[280px] flex-shrink-0 rounded-3xl bg-white/90 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden z-10 relative">
                    <AddMemberModal
                      isOpen={isAddMemberOpen}
                      onClose={() => setIsAddMemberOpen(false)}
                      currentMembers={members}
                      onAddMember={handleAddMemberSubmit}
                      allFriends={friendsAvailableToAdd}
                    />
                    <ViewMembersModal
                      isOpen={isViewMembersOpen}
                      onClose={() => setIsViewMembersOpen(false)}
                      membersList={members}
                    />

                    <div className="h-[60px] flex items-center justify-between px-4 border-b border-[#c3c8bd]/10 shrink-0">
                      <h3 className="text-xs font-bold text-[#1c1c18] uppercase tracking-wider">
                        Thông tin nhóm
                      </h3>
                      <button
                        onClick={() => setIsRightSidebarOpen(false)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840] hover:bg-[#f0eee8] transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          close
                        </span>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 flex flex-col items-center border-b border-[#c3c8bd]/10">
                        <div className="relative w-20 h-20 mb-3">
                          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-[#b0e0f6]/20">
                            <img
                              alt=""
                              className="w-full h-full object-cover"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP0bP5q-Rxagvhq5neetGqD6DLNHvNNsSEuPvgykH-WrvmUNYcewj5m3D4GlRVSV3CkeXZRbQYSc1-9rOun8e9V3LXQG0GJ1pMc3Pc-Pve2GmKrTd8G00Vih6qVlIlZb0Ltk5DD5oqdhOKy00xgpRMzcSUiMa-c8e9Qo-tw_wLiWbabucCPwlLy9h9cgX4OrjoCECC8C_GhoEycM4bxSGwPS-kk8L186tPA2LlyZ4NU4wKOZ88hVr046BSuLKGy-ad4OagU6yv-C8"
                            />
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-[#1c1c18]">
                          {currentActiveChat?.name}
                        </h3>
                        <p className="text-xs text-[#434840]/60">
                          {members.length} Linh hồn tụ họp
                        </p>

                        <div className="flex justify-between w-full mt-4 px-2">
                          <div
                            onClick={() => setIsAddMemberOpen(true)}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#f0eee8] flex items-center justify-center text-[#1c1c18] group-hover:bg-[#a8d5ba]/20 transition-colors">
                              <span className="material-symbols-outlined text-lg">
                                person_add
                              </span>
                            </div>
                            <span className="text-[10px] font-medium text-[#434840]">
                              Thêm
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-[#b0e0f6]/10 flex items-center justify-center text-[#b0e0f6] group-hover:bg-[#b0e0f6]/20 transition-colors">
                              <span className="material-symbols-outlined text-lg">
                                search
                              </span>
                            </div>
                            <span className="text-[10px] font-medium text-[#434840]">
                              Tìm kiếm
                            </span>
                          </div>

                          {/* 🎯 SỬA CHÍNH TẠI ĐÂY: Đổi "Báo thức" -> "Biệt danh", click vào mở danh sách thành viên */}
                          <div
                            onClick={() => setIsViewMembersOpen(true)}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#b0e0f6]/10 flex items-center justify-center text-[#b0e0f6] group-hover:bg-[#b0e0f6]/20 transition-colors">
                              <span className="material-symbols-outlined text-lg">
                                badge
                              </span>
                            </div>
                            <span className="text-[10px] font-medium text-[#434840]">
                              Biệt danh
                            </span>
                          </div>

                          <div
                            onClick={handleLeaveGroupSubmit}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                          >
                            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                              <span className="material-symbols-outlined text-lg">
                                logout
                              </span>
                            </div>
                            <span className="text-[10px] font-medium text-[#434840]">
                              Rời nhóm
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-b border-[#c3c8bd]/10">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-[#1c1c18]">
                            Thành viên ({members.length})
                          </h4>
                          <button
                            onClick={() => setIsViewMembersOpen(true)}
                            className="text-[#b0e0f6] text-xs font-medium hover:underline"
                          >
                            Xem tất cả
                          </button>
                        </div>
                        <div className="flex flex-col gap-3">
                          {members.map((member, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5"
                            >
                              <div className="relative w-8 h-8 shrink-0">
                                <img
                                  alt=""
                                  className="w-full h-full rounded-full object-cover"
                                  src={
                                    member.avatarUrl ||
                                    "https://i.pravatar.cc/100"
                                  }
                                />
                                {member.online && (
                                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#1c1c18] truncate">
                                  {member.nickName || member.username}{" "}
                                  {member.isYou && (
                                    <span className="text-[#434840]/60 font-normal text-[10px]">
                                      (Bạn)
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-[#434840]/60">
                                  {member.online
                                    ? "Đang hoạt động"
                                    : "Ngoại tuyến"}
                                </p>
                              </div>
                              {member.role && (
                                <span className="text-[10px] text-[#a8d5ba] font-semibold">
                                  {member.role}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border-b border-[#c3c8bd]/10">
                        <div className="flex justify-between items-center mb-3 cursor-pointer group">
                          <h4 className="text-xs font-bold text-[#1c1c18]">
                            Phương tiện đã chia sẻ
                          </h4>
                          <span className="material-symbols-outlined text-[#434840]/60 group-hover:text-[#b0e0f6] text-lg">
                            chevron_right
                          </span>
                        </div>
                        <div className="flex gap-1.5 justify-between">
                          <img
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXksRxTWMdPMdx7gh9O5fyoQeyi1ZZulJyHjxujKXxeAT3iW3Apm_o5BF9VUt2QtF4jdewl9fxDLNEP9mKjnV10c41PyrK9JkzTRyQtKLzbhO3qcaMxSQn9luFAfT62pc-DTjNgRCisl6ygSVK7KGw6H56pwAUOA-URWHjR2UibwGREVdhuTNOS8FxNaCL8BywAm3RwkSf-8trTRN56ZdCJ9S38sKhlTbs6ZtVLDQoKj0omJo8tbX4xedfsiRzdoavrdd9iI77Tq0"
                          />
                          <img
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnc7JSk99vzS_o4UmNd1jwkafcH0cI43oXuD3htmyEiYbCOnHXbusaCbsr-nbDO7wR8PUvT7FZkaeeBdmFxvmMl2-tWaZHSyKMEwO8f2m7c0NKdZkoiapiAqRsqGnK7GEw-vpqPYJkcTYmNAOlJOl0Z6_SY7CaLenNtNpmCRUOsI8GjlJMCp4SqIv3vETUP_PfR2mKXzVHpVjwAHfvm2tQ81tNyyAG8spZEpu5H4Z_xJ2eG99f5c5BDsUgJe-Nn1eN2sIhLQx3dtw"
                          />
                          <img
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8woP-nS8fgrLHrnbRpM58srGsRUCU4u_sSnol28F8UyAENgMVhaVeawZVyTj2q2e_Dm3PwTVNWNNExcwU8n4onsZtPiVbapf0XNZcB_OaPRTgX_2iCxHhsJPLHWEyJoM3AOZODu1NW2KdcEPLvZUV5fbUG6sYyooYq4utZUhUIqi7Qxxg5bihPidBvGNEfbv5eBegNXTcu2yc0MZmrAeRt_rZ9Gw3YvT7kBZlhrN9hYmxqmgFRmVAUdYhS_cO_fzFsjkdKt7Rchw"
                          />
                          <div className="w-14 h-14 rounded-lg bg-[#f0eee8] flex items-center justify-center cursor-pointer hover:bg-[#ebe8e2] transition-colors">
                            <span className="material-symbols-outlined text-[#434840]/60">
                              chevron_right
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
