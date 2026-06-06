import axios from "axios";

// --- 1. CẤU HÌNH ĐƯỜNG DẪN BACKEND THEO BIẾN MÔI TRƯỜNG VITE ---
// Nếu ở máy local (không cấu hình .env), hệ thống tự động fallback về http://localhost:8086/api
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8086/api";

// --- 2. KHỞI TẠO AXIOS CLIENT ---
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// --- 3. BỘ CHẶN REQUEST: TỰ ĐỘNG ĐÍNH KÈM ACCESS TOKEN ---
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- 4. BỘ CHẶN RESPONSE: TỰ ĐỘNG REFRESH REAL-TIME KHI TOKEN HẾT HẠN (401) ---
apiClient.interceptors.response.use(
    (response) => {
        // Trả về trực tiếp phần dữ liệu JSON từ Server { code, message, data }
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu HTTP Status là 401 Unauthorized (Mã thông báo hết hạn)
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Ngăn chặn vòng lặp vô hạn: Nếu chính request refresh cũng bị 401 -> Logout luôn
            if (originalRequest.url.includes("/auth/refresh")) {
                handleLogout();
                return Promise.reject(error);
            }

            // Nếu đang có một request khác đi làm mới token, bắt request này xếp hàng đợi
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        // SỬA LỖI TẠI ĐÂY: Phải bọc trong apiClient(originalRequest) trực tiếp để 
                        // khi request này chạy lại, nó đi qua hàm interceptor response thành công và lấy thẳng dữ liệu .data
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    const currentRefreshToken = localStorage.getItem("refreshToken");

                    // Gọi API làm mới token sang Endpoint AuthController của bạn
                    // Sử dụng instance axios gốc để tránh bị bộ chặn request can thiệp đính kèm token cũ
                    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken: currentRefreshToken, // Gửi đúng trường tương thích với RefreshTokenRequest.java
                    });

                    // Cấu trúc phản hồi từ ApiResponse mẫu của bạn: res.data.code === 200
                    if (res.data && res.data.code === 200) {
                        // Trích xuất dữ liệu từ lớp bọc `.data` (khớp với LoginResponse.java)
                        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

                        // Cập nhật lại cặp mã thông báo mới vào bộ nhớ
                        localStorage.setItem("accessToken", accessToken);
                        if (newRefreshToken) {
                            localStorage.setItem("refreshToken", newRefreshToken);
                        }

                        // Thay mã thông báo mới vào request đang bị hoãn
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                        // Kích hoạt lại toàn bộ các request đang nằm trong hàng đợi
                        processQueue(null, accessToken);

                        // Thực thi lại request ban đầu và trả về dữ liệu cho luồng Front-end
                        resolve(apiClient(originalRequest));
                    } else {
                        handleLogout();
                        reject(error);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    handleLogout();
                    reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        // Ném lỗi về định dạng chuỗi tin nhắn để các khối catch ở file giao diện hiển thị được
        const errorResult = error.response?.data || {};
        return Promise.reject(new Error(errorResult.message || "API_ERROR"));
    }
);

const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    window.location.href = "/login";
};

// --- 5. DANH SÁCH CÁC API HOÀN CHỈNH ---

export const loginApi = async (data) => {
    return apiClient.post("/auth/login", data);
};

export const registerApi = async (data) => {
    return apiClient.post("/auth/register", data);
};

export const getConversationsApi = async () => {
    return apiClient.get("/conversations");
};

export const getMessagesByConversationApi = async (conversationId) => {
    return apiClient.get(`/messages/conversation/${conversationId}`);
};

export const getConversationMembersApi = async (conversationId) => {
    return apiClient.get(`/conversations/${conversationId}/members`);
};

export const addConversationMemberApi = async (conversationId, data) => {
    return apiClient.post(`/conversations/${conversationId}/members`, data);
};

export const removeConversationMemberApi = async (conversationId, userId) => {
    return apiClient.delete(`/conversations/${conversationId}/members/${userId}`);
};

export const leaveConversationApi = async (conversationId) => {
    return apiClient.post(`/conversations/${conversationId}/leave`);
};

export const sendMessageApi = async (formData) => {
    return apiClient.post("/messages", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const editMessageApi = async (data) => {
    return apiClient.put("/messages/edit", data);
};

export const recallMessageApi = async (messageId) => {
    return apiClient.post(`/messages/${messageId}/recall`);
};

export const searchUsersApi = async (data) => {
    return apiClient.post("/users/search", data);
};

export const requestFriendApi = async (targetUserId) => {
    return apiClient.post(`/friendships/request/${targetUserId}`);
};

export const acceptFriendRequest = async (targetUserId) => {
    return apiClient.post(`/friendships/accept/${targetUserId}`);
};

export const removeFriend = async (targetUserId) => {
    return apiClient.delete(`/friendships/remove/${targetUserId}`);
};

export const getPendingRequestsApi = async () => {
    return apiClient.get("/friendships/requests/pending");
};

export const getFriendsApi = async (searchQuery = "") => {
    if (searchQuery.trim() !== "") {
        return searchUsersApi({ keyword: searchQuery });
    }
    return apiClient.get("/friendships/friends");
};

export const getOrCreatePrivateChatApi = async (targetUserId) => {
    return apiClient.post(`/conversations/private/${targetUserId}`);
};

export const createConversationApi = async (data) => {
    return apiClient.post("/conversations", data);
};

export const updateNicknameApi = async (data) => {
    return apiClient.put("/conversations/member/nickname", data);
};

export const searchMessagesApi = async (conversationId, keyword) => {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    return apiClient.get(`/messages/searchMessage?conversationId=${conversationId}&keyword=${encodedKeyword}`);
};

export const getMyProfileApi = async () => {
    return apiClient.get("/users/me");
};

export const seenMessageApi = async (conversationId, messageId) => {
    return apiClient.put("/messages/seen", {
        conversationId: conversationId,
        messageId: messageId
    });
};