import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;
let subscriptions = [];

export const connectWebSocket = (activeChatId, onMessageReceived, onMessageEdited, onMessageRecalled, onUserTyping) => {
    if (stompClient && stompClient.connected) {
        updateSubscriptions(activeChatId, onMessageReceived, onMessageEdited, onMessageRecalled, onUserTyping);
        return;
    }

    const socket = new SockJS("http://localhost:8086/ws");
    stompClient = Stomp.over(socket);

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };

    stompClient.connect(headers, () => {
        console.log("🚀 Kết nối WebSocket thành công!");
        updateSubscriptions(activeChatId, onMessageReceived, onMessageEdited, onMessageRecalled, onUserTyping);
    }, (error) => {
        console.error("❌ Lỗi kết nối WebSocket:", error);
        setTimeout(() => connectWebSocket(activeChatId, onMessageReceived, onMessageEdited, onMessageRecalled, onUserTyping), 5000);
    });
};

const updateSubscriptions = (activeChatId, onMessageReceived, onMessageEdited, onMessageRecalled, onUserTyping) => {
    if (!stompClient || !stompClient.connected) return;

    subscriptions.forEach((sub) => sub.unsubscribe());
    subscriptions = [];

    console.log(`📡 Đang thiết lập kênh lắng nghe realtime tại /topic/conversations/${activeChatId}`);

    const chatSub = stompClient.subscribe(`/topic/conversations/${activeChatId}`, (sdkEvent) => {
        const data = JSON.parse(sdkEvent.body);
        console.log("📥 Nhận dữ liệu tin nhắn realtime từ Backend:", data);

        if (data.messageId && !data.id) {
            console.log("🗑️ Thực hiện thu hồi tin nhắn trên giao diện:", data.messageId);
            onMessageRecalled(data);
        }
        else if (data.isEdited) {
            console.log("✏️ Thực hiện cập nhật tin nhắn vừa sửa trên giao diện:", data.id);
            onMessageEdited(data);
        }
        else {
            console.log("💬 Thêm tin nhắn mới vào danh sách hiển thị:", data.id);
            onMessageReceived(data);
        }
    });
    subscriptions.push(chatSub);

    const typingSub = stompClient.subscribe(`/topic/conversations/${activeChatId}/typing`, (sdkEvent) => {
        const typingData = JSON.parse(sdkEvent.body);
        console.log("⌨️ Trạng thái nhập liệu thay đổi từ Backend:", typingData);

        if (onUserTyping) {
            onUserTyping(typingData);
        }
    });
    subscriptions.push(typingSub);
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