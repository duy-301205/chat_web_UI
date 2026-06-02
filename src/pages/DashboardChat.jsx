import React, { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import SidebarChat from "./SidebarChat";
import FindSpirits from "../components/FindSpirits";
import CreateGroupModal from "../components/CreateGroupModel";
import EmptyChatState from "../components/EmptyChatState";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import RightSidebar from "../components/RightSidebar";

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
      title,
      desc,
      time: "Vừa xong",
      isUnread: true,
      icon,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // --- API CALLS ---
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const result = await getConversationsApi();
        if (result.code === 200) setChatList(result.data || []);
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
        if (result.code === 200) setMembers(result.data || []);
      } catch (error) {
        console.error("Lấy danh sách thành viên thất bại:", error.message);
      }
    };
    fetchMembers();
  }, [activeChatId]);

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
      formData.append(
        "data",
        JSON.stringify({
          conversationId: activeChatId,
          content: inputText.trim(),
        }),
      );
      const result = await sendMessageApi(formData);
      if (result) {
        setInputText("");
        await fetchMessages();
      }
    } catch (error) {
      console.error("Gửi tin nhắn thất bại:", error.message);
    }
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

  const handleAddMemberSubmit = async (data) => {
    try {
      const result = await addConversationMemberApi(activeChatId, data);
      if (result) {
        pushSystemNotification(
          "Hội nhóm",
          "Đã thêm thành viên mới thành công. 🌿",
          "group_add",
        );
        const res = await getConversationMembersApi(activeChatId);
        if (res.code === 200) setMembers(res.data || []);
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
      if (result) {
        pushSystemNotification(
          "Hội nhóm",
          `Bạn đã rời khỏi nhóm trò chuyện. 🍃`,
          "logout",
        );
        setChatList((prev) => prev.filter((chat) => chat.id !== activeChatId));
        setActiveChatId(null);
      }
    } catch (error) {
      console.error("Rời nhóm thất bại:", error.message);
    }
  };

  // --- FILTER CHAT & DATA MATCHING ---
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
            !chatList.some((c) => c.name === u.name),
        )
      : [];

  const currentActiveChat = chatList.find((chat) => chat.id === activeChatId);

  const friendsAvailableToAdd = globalUsersZone.filter(
    (friend) =>
      !members.some(
        (member) =>
          String(friend.id || friend.userId || "") ===
          String(member.id || member.userId || ""),
      ),
  );

  return (
    <div
      className="h-screen w-screen overflow-hidden text-[#1c1c18] font-sans antialiased bg-cover bg-center bg-fixed p-4 notranslate"
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
          handleAddFriend={(u) =>
            pushSystemNotification(
              "Kết bạn",
              `Đã gửi yêu cầu kết bạn đến ${u.name}.`,
              "person_add",
            )
          }
          setIsCreateGroupOpen={setIsCreateGroupOpen}
        />

        {view === "spirits" ? (
          <FindSpirits
            onAddFriend={(u) =>
              pushSystemNotification(
                "Kết bạn",
                `Đã gửi yêu cầu đến ${u.name}.`,
                "person_add",
              )
            }
          />
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
                setChatList([newGroup, ...chatList]);
                setActiveChatId(newGroup.id);
                setView("chat");
              }}
            />

            {!activeChatId ? (
              <EmptyChatState />
            ) : (
              <>
                {/* Khung chat chính */}
                <main className="flex-1 rounded-3xl bg-[rgba(253,251,247,0.9)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden relative z-10">
                  <ChatHeader
                    currentActiveChat={currentActiveChat}
                    memberCount={members.length}
                    onToggleSidebar={() =>
                      setIsRightSidebarOpen(!isRightSidebarOpen)
                    }
                  />
                  <MessageList
                    messages={messages}
                    onStartEdit={(msg) => {
                      if (!msg.isDeleted) {
                        setEditingMessageId(msg.id);
                        setInputText(msg.content);
                      }
                    }}
                    onRecallMessage={handleRecallMessage}
                  />
                  <ChatInput
                    inputText={inputText}
                    setInputText={setInputText}
                    editingMessageId={editingMessageId}
                    setEditingMessageId={setEditingMessageId}
                    onSendMessage={handleSendMessage}
                  />
                </main>

                {/* Sidebar phải */}
                {isRightSidebarOpen && (
                  <RightSidebar
                    onClose={() => setIsRightSidebarOpen(false)}
                    currentActiveChat={currentActiveChat}
                    members={members}
                    isAddMemberOpen={isAddMemberOpen}
                    setIsAddMemberOpen={setIsAddMemberOpen}
                    isViewMembersOpen={isViewMembersOpen}
                    setIsViewMembersOpen={setIsViewMembersOpen}
                    friendsAvailableToAdd={friendsAvailableToAdd}
                    handleAddMemberSubmit={handleAddMemberSubmit}
                    handleLeaveGroupSubmit={handleLeaveGroupSubmit}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
