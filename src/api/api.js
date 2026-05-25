const API_BASE_URL = "http://localhost:8086/api/auth";

const request = async (url, options) => {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok || result.code !== 200) {
        throw new Error(result.message || "API_ERROR");
    }

    return result;
};

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const loginApi = async (data) => {
    return request(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const registerApi = async (data) => {
    return request(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const getConversationsApi = async () => {
    return request("http://localhost:8086/api/conversations", {
        method: "GET",
        headers: authHeaders(),
    });
};

export const getMessagesByConversationApi = async (conversationId) => {
    return request(
        `http://localhost:8086/api/messages/conversation/${conversationId}`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );
};

export const getConversationMembersApi = async (conversationId) => {
    return request(
        `http://localhost:8086/api/conversations/${conversationId}/members`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );
};

export const addConversationMemberApi = async (conversationId, data) => {
    return request(
        `http://localhost:8086/api/conversations/${conversationId}/members`,
        {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(data),
        }
    );
};

export const removeConversationMemberApi = async (
    conversationId,
    userId
) => {
    return request(
        `http://localhost:8086/api/conversations/${conversationId}/members/${userId}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );
};

export const leaveConversationApi = async (conversationId) => {
    return request(
        `http://localhost:8086/api/conversations/${conversationId}/leave`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );
};

export const sendMessageApi = async (formData) => {
    return request("http://localhost:8086/api/messages", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
    });
};

// API: Chỉnh sửa nội dung tin nhắn văn bản
export const editMessageApi = async (data) => {
    return request("http://localhost:8086/api/messages/edit", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
};

// API: Thu hồi tin nhắn theo ID
export const recallMessageApi = async (messageId) => {
    return request(`http://localhost:8086/api/messages/${messageId}/recall`, {
        method: "POST", // Hoặc "DELETE" tùy cấu hình Backend, mặc định POST theo đặc tả URL của bạn
        headers: authHeaders(),
    });
};