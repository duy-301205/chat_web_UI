import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;
let subscriptions = [];

// 🎯 Nhận tham số subscribedIds để lắng nghe đa phòng và Kênh Tổng
export const connectWebSocket = (
    activeChatId,
    subscribedIds,
    onMessageReceived,
    onMessageEdited,
    onMessageRecalled,
    onUserTyping,
    onMessageSeenReceived
) => {
    if (stompClient && stompClient.connected) {
        updateSubscriptions(activeChatId, subscribedIds, onMessageReceived, onMessageEdited, onMessageRecalled, onUserTyping, onMessageSeenReceived);
        return;
    }

    // TỰ ĐỘNG CHUYỂN ĐỔI URL WEBSOCKET THEO MÔI TRƯỜNG VERCEL / LOCAL
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8086/api";
    const WS_URL = BASE_URL.replace(/\/api$/, "") + "/ws";

    const socket = new SockJS(WS_URL);
    stompClient = Stomp.over(socket);

    // Tắt bớt log debug ping-pong mặc định của Stomp để tránh tràn tab Console F12
    stompClient.debug = null;

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };

    stompClient.connect(headers, () => {
        console.log("🚀 Kết nối WebSocket tổng thành công!");
        updateSubscriptions(activeChatId, subscribedIds, onMessageReceived, onMessageEdited, onMessageRecalled, onUserTyping, onMessageSeenReceived);
    }, (error) => {
        console.error("❌ Lỗi kết nối WebSocket:", error);
        // Tự động kết nối lại sau 5 giây nếu gặp sự cố sập mạng
        setTimeout(() => {
            connectWebSocket(activeChatId, subscribedIds, onMessageReceived, onMessageEdited, onMessageRecalled, onUserTyping, onMessageSeenReceived);
        }, 5000);
    });
};

const updateSubscriptions = (
    activeChatId,
    subscribedIds = [],
    onMessageReceived,
    onMessageEdited,
    onMessageRecalled,
    onUserTyping,
    onMessageSeenReceived
) => {
    if (!stompClient || !stompClient.connected) return;

    // Hủy bỏ toàn bộ các kênh lắng nghe cũ trước khi đăng ký mới để tránh rò rỉ bộ nhớ (Memory Leak)
    subscriptions.forEach((sub) => sub.unsubscribe());
    subscriptions = [];

    // ==========================================
    // 🎯 LUỒNG CẤT CÁNH: LẮNG NGHE KÊNH TỔNG SIDEBAR CÁ NHÂN (MESSENGER STYLE)
    // ==========================================
    const currentUserId = localStorage.getItem("userId");
    if (currentUserId) {
        console.log(`📡 Đang đăng ký Kênh Tổng Sidebar cá nhân tại: /topic/user/${currentUserId}/sidebar`);

        const sidebarSub = stompClient.subscribe(`/topic/user/${currentUserId}/sidebar`, (sdkEvent) => {
            const newMsg = JSON.parse(sdkEvent.body);
            console.log("📥 Kênh Tổng nhận dữ liệu tin nhắn mới cho Sidebar:", newMsg);

            if (onMessageReceived) {
                onMessageReceived(newMsg);
            }
        });
        subscriptions.push(sidebarSub);
    }

    // ==========================================
    // LUỒNG 1: LẮNG NGHE ĐA KÊNH CHO SIDEBAR (REALTIME CHO TẤT CẢ CÁC PHÒNG CHAT CŨ)
    // ==========================================
    if (subscribedIds && subscribedIds.length > 0) {
        subscribedIds.forEach((chatId) => {
            const listSub = stompClient.subscribe(`/topic/conversations/${chatId}`, (sdkEvent) => {
                const data = JSON.parse(sdkEvent.body);

                if (!data.conversationId) data.conversationId = chatId;

                if (data.messageId && !data.id) {
                    if (onMessageRecalled) onMessageRecalled(data);
                } else if (data.isEdited) {
                    if (onMessageEdited) onMessageEdited(data);
                } else {
                    if (onMessageReceived) onMessageReceived(data);
                }
            });
            subscriptions.push(listSub);

            const listSeenSub = stompClient.subscribe(`/topic/conversations/${chatId}/seen`, (sdkEvent) => {
                const seenData = JSON.parse(sdkEvent.body);
                if (!seenData.conversationId) seenData.conversationId = chatId;
                if (onMessageSeenReceived) {
                    onMessageSeenReceived(seenData);
                }
            });
            subscriptions.push(listSeenSub);
        });
    }

    // ==========================================
    // LUỒNG 2: LẮNG NGHE CHI TIẾT TRẠNG THÁI RIÊNG CHO PHÒNG CHAT ĐANG MỞ
    // ==========================================
    if (activeChatId) {
        console.log(`📡 Đang thiết lập kênh lắng nghe chi tiết phụ trợ tại phòng: ${activeChatId}`);

        const typingSub = stompClient.subscribe(`/topic/conversations/${activeChatId}/typing`, (sdkEvent) => {
            const typingData = JSON.parse(sdkEvent.body);
            if (onUserTyping) {
                onUserTyping(typingData);
            }
        });
        subscriptions.push(typingSub);
    }
};

export const disconnectWebSocket = () => {
    subscriptions.forEach((sub) => sub.unsubscribe());
    subscriptions = [];
    if (stompClient !== null && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log("🔌 Đã ngắt kết nối WebSocket hoàn toàn.");
        });
        stompClient = null;
    }
};

export const sendWSMessage = (destination, body) => {
    if (stompClient && stompClient.connected) {
        stompClient.send(destination, {}, JSON.stringify(body));
    } else {
        console.error("❌ Không thể gửi lệnh qua WS vì chưa kết nối:", destination);
    }
};