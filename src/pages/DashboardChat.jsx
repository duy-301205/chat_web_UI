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
  connectWebSocket,
  disconnectWebSocket,
  sendWSMessage,
} from "../api/webSocketService";

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
  updateNicknameApi,
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

  const [isPartnerTyping, setIsPartnerTyping] = useState("");
  const currentUserId = Number(localStorage.getItem("userId"));

  const handleJumpToMessage = (messageId) => {
    const element = document.getElementById(`msg-${messageId}`);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      element.classList.add(
        "!bg-yellow-200/80",
        "ring-2",
        "ring-yellow-400/50",
        "scale-[1.02]",
      );

      setTimeout(() => {
        element.classList.remove(
          "!bg-yellow-200/80",
          "ring-2",
          "ring-yellow-400/50",
          "scale-[1.02]",
        );
      }, 2000);
    } else {
      console.warn("Không tìm thấy phần tử tin nhắn trên màn hình hiển thị.");
    }
  };

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

        console.log("🔍 CẤU TRÚC TIN NHẮN TỪ BACKEND ĐỔ VỀ:", sortedMessages);
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error("Lấy tin nhắn thất bại:", error.message);
    }
  };

  useEffect(() => {
    setMessages([]);
    setIsPartnerTyping("");
    fetchMessages();
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId || !messages || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    const isFromMe = Number(lastMsg.senderId) === currentUserId;

    if (!isFromMe) {
      console.log(
        "🎯 Thực hiện gửi tín hiệu Đã xem cho tin nhắn phòng đang mở ID:",
        lastMsg.id,
      );

      sendWSMessage("/app/chat.seen", {
        conversationId: Number(activeChatId),
        messageId: Number(lastMsg.id),
      });

      setChatList((prevList) =>
        prevList.map((chat) =>
          Number(chat.id) === Number(activeChatId)
            ? { ...chat, unreadCount: 0 }
            : chat,
        ),
      );
    }
  }, [messages, activeChatId, currentUserId]);

  useEffect(() => {
    if (!activeChatId) {
      setMembers([]);
      return;
    }
    const fetchMembers = async () => {
      try {
        const result = await getConversationMembersApi(activeChatId);
        if (result.code === 200 && result.data) {
          const normalizedMembers = result.data.map((m) => {
            const memberUserId = m.userId || m.id;
            return {
              userId: memberUserId,
              username: m.username || "Ẩn danh",
              nickname: m.nickname || m.nickName || "",
              avatarUrl: m.avatarUrl || "https://i.pravatar.cc/100",
              online: m.online || m.isOnline || false,
              role: m.role || "MEMBER",
              isYou: memberUserId
                ? Number(memberUserId) === currentUserId
                : false,
              lastSeenMessageId:
                m.lastSeenMessageId || m.lastMessageSeenId || null,
            };
          });
          setMembers(normalizedMembers);
        }
      } catch (error) {
        console.error("Lấy danh sách thành viên thất bại:", error.message);
      }
    };
    fetchMembers();
  }, [activeChatId, currentUserId]);

  useEffect(() => {
    if (!activeChatId) return;

    const onMessageReceived = (newMsg) => {
      if (Number(newMsg.conversationId) === Number(activeChatId)) {
        setMessages((prevMessages) => {
          if (prevMessages.some((m) => m.id === newMsg.id)) return prevMessages;
          return [...prevMessages, newMsg].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          );
        });
      }

      setChatList((prevList) => {
        const existingChat = prevList.find(
          (chat) => Number(chat.id) === Number(newMsg.conversationId),
        );

        if (existingChat) {
          const isCurrentActiveChat =
            Number(newMsg.conversationId) === Number(activeChatId);
          const isFromMe = Number(newMsg.senderId) === currentUserId;

          const newUnreadCount =
            !isFromMe && !isCurrentActiveChat
              ? (existingChat.unreadCount || 0) + 1
              : 0;

          const updatedChat = {
            ...existingChat,
            lastMessage: newMsg.content,
            lastMessageSenderId: newMsg.senderId,
            lastMessageSenderName: isFromMe
              ? "You"
              : newMsg.senderName || "Thành viên",
            lastMessageAt: newMsg.createdAt,
            unreadCount: newUnreadCount,
          };

          const remainingChats = prevList.filter(
            (chat) => Number(chat.id) !== Number(newMsg.conversationId),
          );
          return [updatedChat, ...remainingChats];
        }

        return prevList;
      });

      if (
        Number(newMsg.senderId) !== currentUserId &&
        Number(newMsg.conversationId) === Number(activeChatId)
      ) {
        sendWSMessage("/app/chat.seen", {
          conversationId: Number(activeChatId),
          messageId: Number(newMsg.id),
        });
      }
    };

    const onMessageEdited = (editedMsg) => {
      if (Number(editedMsg.conversationId) === Number(activeChatId)) {
        setMessages((prevMessages) =>
          prevMessages.map((m) => (m.id === editedMsg.id ? editedMsg : m)),
        );
      }
    };

    const onMessageRecalled = (recalledData) => {
      if (Number(recalledData.conversationId) === Number(activeChatId)) {
        setMessages((prevMessages) =>
          prevMessages.map((m) =>
            m.id === recalledData.messageId
              ? { ...m, isDeleted: true, content: "Tin nhắn đã bị xóa" }
              : m,
          ),
        );
      }
    };

    const onUserTyping = (typingData) => {
      if (typingData.userId !== currentUserId) {
        if (typingData.isTyping) {
          setIsPartnerTyping(typingData.username || "Ai đó");
        } else {
          setIsPartnerTyping("");
        }
      }
    };

    const onMessageSeenReceived = (seenData) => {
      console.log(
        "👁️ WebSocket nhận tín hiệu trạng thái đã xem (Realtime):",
        seenData,
      );

      setChatList((prevList) =>
        prevList.map((chat) =>
          Number(chat.id) === Number(seenData.conversationId)
            ? { ...chat, unreadCount: 0 }
            : chat,
        ),
      );

      setMembers((prevMembers) =>
        prevMembers.map((m) =>
          Number(m.userId) === Number(seenData.userId || seenData.senderId)
            ? { ...m, lastSeenMessageId: seenData.messageId }
            : m,
        ),
      );
    };

    const subscribedIds = chatList.map((c) => c.id);

    connectWebSocket(
      activeChatId,
      subscribedIds,
      onMessageReceived,
      onMessageEdited,
      onMessageRecalled,
      onUserTyping,
      onMessageSeenReceived,
    );

    return () => {
      disconnectWebSocket();
    };
  }, [activeChatId, currentUserId, chatList.length]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChatId) return;

    if (editingMessageId) {
      const editRequest = {
        messageId: editingMessageId,
        content: inputText.trim(),
        conversationId: activeChatId,
      };

      sendWSMessage("/app/chat.editMessage", editRequest);
      setInputText("");
      setEditingMessageId(null);
      pushSystemNotification(
        "Tin nhắn",
        "Đã cập nhật nội dung tin nhắn. ✨",
        "edit",
      );
      return;
    }

    const messageRequest = {
      conversationId: activeChatId,
      content: inputText.trim(),
      senderId: currentUserId,
    };

    sendWSMessage("/app/chat.sendMessage", messageRequest);
    setInputText("");
  };

  const handleRecallMessage = async (messageId) => {
    const recallRequest = {
      messageId: messageId,
      conversationId: activeChatId,
    };

    sendWSMessage("/app/chat.recallMessage", recallRequest);
    pushSystemNotification("Tin nhắn", "Tin nhắn đã được thu hồi.", "history");
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
        if (res.code === 200 && res.data) {
          const normalized = res.data.map((m) => {
            const memberUserId = m.userId || m.id;
            return {
              userId: memberUserId,
              username: m.username || "Ẩn danh",
              nickname: m.nickname || m.nickName || "",
              avatarUrl: m.avatarUrl || "https://i.pravatar.cc/100",
              online: m.online || m.isOnline || false,
              role: m.role || "MEMBER",
              isYou: memberUserId
                ? Number(memberUserId) === currentUserId
                : false,
            };
          });
          setMembers(normalized);
        }
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

  const handleUpdateNicknameSubmit = async (
    conversationId,
    userId,
    newNickname,
  ) => {
    try {
      const payload = {
        conversationId: conversationId,
        userId: userId,
        nickname: newNickname,
      };

      await updateNicknameApi(payload);

      setMembers((prevMembers) =>
        prevMembers.map((m) =>
          m.userId === userId
            ? {
                ...m,
                nickname: newNickname.trim(),
                nickName: newNickname.trim(),
              }
            : m,
        ),
      );

      pushSystemNotification(
        "Hội nhóm",
        "Đã cập nhật biệt danh thành viên mới. ✨",
        "badge",
      );
    } catch (error) {
      console.error("Cập nhật biệt danh thất bại:", error.message);
    }
  };

  const filteredChatList = chatList.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "unread") return chat.unreadCount > 0;
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
          String(member.userId || member.id || ""),
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
          <MyProfile onBack={() => setView("chat")} />
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
                    members={members}
                    isPartnerTyping={isPartnerTyping}
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
                    activeChatId={activeChatId}
                    currentUserId={currentUserId}
                  />
                </main>

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
                    handleUpdateNicknameSubmit={handleUpdateNicknameSubmit}
                    onJumpToMessage={handleJumpToMessage}
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
