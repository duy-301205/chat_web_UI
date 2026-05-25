// chatData.js
export const initialChatList = [
    {
        id: 1,
        name: "Rừng Totoro",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAP0bP5q-Rxagvhq5neetGqD6DLNHvNNsSEuPvgykH-WrvmUNYcewj5m3D4GlRVSV3CkeXZRbQYSc1-9rOun8e9V3LXQG0GJ1pMc3Pc-Pve2GmKrTd8G00Vih6qVlIlZb0Ltk5DD5oqdhOKy00xgpRMzcSUiMa-c8e9Qo-tw_wLiWbabucCPwlLy9h9cgX4OrjoCECC8C_GhoEycM4bxSGwPS-kk8L186tPA2LlyZ4NU4wKOZ88hVr046BSuLKGy-ad4OagU6yv-C8",
        time: "14:30",
        lastMessage: "Tôi sẽ mang một ít trà...",
        sender: "Komorebi:",
        unread: 3,
        isGroup: true,
    },
    {
        id: 2,
        name: "Satsuki",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbEnfWoJN0FdX8Q0Hq4yE8WQ3NjFAwW0TcMQACprWtM0VqxxbP1Sgw0eTqykmNfDZtFBy5ZvIH7SWwAmyOrrWEZ6SNR5scHsWMxBKtKscaJs0DiDoWB6sFt2FbPH_8rzfVPcOquHc9qOYVx_JaEDZHkEXwuv8Z_pJaZK0Mmat7-6orD3w26bB58PGA5o0wGsPr_7hi6gC5oxa1ObU1SEiwFjt8hNqMPeiirCHzBeMFigp_WK806igADIPMmBDV0oIF-KOC-QfcS0o",
        time: "14:28",
        lastMessage: "Okie, mình cảm ơn nhaa 🌸",
        sender: "Bạn:",
        unread: 0,
        isOnline: true,
        isGroup: false,
    },
    {
        id: 3,
        name: "Mei",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHOA6JzXhWkDkkk6txfQ34mARY-BslsFdLmm1Lu5E8mwn97qpLRXwJV6lVomfjtcUGMaWQLcAEJXIwDKhdQFX6SN8soBnkKirRUlSgD95DTGGlJGWenv-1Ir3_aRUXYxlLjMWbxnBM_Fei4TtozkR_eLjl5879HdbmB6qwh-5KAvWRU8YRRIo0j7K1ytBxrKtEH32fWqLYpb4MPHS1K3QFAVgXfDdfk-1PaGZryriCXL22S1gA-5cPbXxPvE0LYWycsCmUYFSHrKg",
        time: "14:20",
        lastMessage: "Nhìn xem em tìm thấy gì này!",
        sender: "Mei:",
        unread: 1,
        isOnline: true,
        isGroup: false,
    },
    {
        id: 4,
        name: "Hội Trồng Cây Bảo Vệ Rừng",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbEnfWoJN0FdX8Q0Hq4yE8WQ3NjFAwW0TcMQACprWtM0VqxxbP1Sgw0eTqykmNfDZtFBy5ZvIH7SWwAmyOrrWEZ6SNR5scHsWMxBKtKscaJs0DiDoWB8sFt2FbPH_8rzfVPcOquHc9qOYVx_JaEDZHkEXwuv8Z_pJaZK0Mmat7-6orD3w26bB58PGA5o0wGsPr_7hi6gC5oxa1ObU1SEiwFjt8hNqMPeiirCHzBeMFigp_WK806igADIPMmBDV0oIF-KOC-QfcS0o",
        time: "Hôm qua",
        lastMessage: "Hạt giống sồi đã nảy mầm chưa?",
        sender: "Bác Kanta:",
        unread: 0,
        isGroup: true,
    },
    {
        id: 5,
        name: "Chị Kusa",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnc7JSk99vzS_o4UmNd1jwkafcH0cI43oXuD3htmyEiYbCOnHXbusaCbsr-nbDO7wR8PUvT7FZkaeeBdmFxvmMl2-tWaZHSyKMEwO8f2m7c0NKdZkoiapiAqRsqGnK7GEw-vpqPYJkcTYmNAOlJOl0Z6_SY7CaLenNtNpmCRUOsI8GjlJMCp4SqIv3vETUP_PfR2mKXzVHpVjwAHfvm2tQ81tNyyAG8spZEpu5H4Z_xJ2eG99f5c5BDsUgJe-Nn1eN2sIhLQx3dtw",
        time: "Thứ 2",
        lastMessage: "Em gửi cho chị lịch dạo chơi đền cổ nhé.",
        sender: "Chị Kusa:",
        unread: 2,
        isOnline: false,
        isGroup: false,
    },
];

export const globalUsersZone = [
    {
        id: 10,
        name: "Vô Diện (No Face)",
        avatar: "https://i.pravatar.cc/150?img=33",
        bio: "Thích ăn bánh và uống trà tĩnh lặng...",
    },
    {
        id: 11,
        name: "Thần Sông (River Spirit)",
        avatar: "https://i.pravatar.cc/150?img=12",
        bio: "Trông coi những dòng suối trong lành.",
    },
    {
        id: 12,
        name: "Kanta",
        avatar: "https://i.pravatar.cc/150?img=60",
        bio: "Người hay ngại ngùng thích giúp đỡ.",
    },
];

export const initialMembers = [
    {
        name: "Komorebi",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKO3NcUUT9Ts-_ErM6wnIUd1MxKV9fXhf30YSdR24XNeEhzDXtKj3sRAPhqA68KvV-NrSYwYF4P_uOpGfwOhtCposCmVuOG1dcY0nAAflmt8FhHcHVZd5dQljb4xgVdsCyLa6a9wuqsLn7Z_UKHrnyFzvKekyrt-8bc0QAr1qiapbtparkDdbrdro6Rj3yYMZ87sXY5VrRoh7rBWqpTzlHMSpz8nJnFaTCZCB8XQZbROIldnpskTIpwiQgqo8xnbshULTcTfJg2MQ",
        role: "Trưởng nhóm",
        isYou: true,
    },
    {
        name: "Satsuki",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbEnfWoJN0FdX8Q0Hq4yE8WQ3NjFAwW0TcMQACprWtM0VqxxbP1Sgw0eTqykmNfDZtFBy5ZvIH7SWwAmyOrrWEZ6SNR5scHsWMxBKtKscaJs0DiDoWB6sFt2FbPH_8rzfVPcOquHc9qOYVx_JaEDZHkEXwuv8Z_pJaZK0Mmat7-6orD3w26bB58PGA5o0wGsPr_7hi6gC5oxa1ObU1SEiwFjt8hNqMPeiirCHzBeMFigp_WK806igADIPMmBDV0oIF-KOC-QfcS0o",
        status: "Trực tuyến",
    },
    {
        name: "Mei",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHOA6JzXhWkDkkk6txfQ34mARY-BslsFdLmm1Lu5E8mwn97qpLRXwJV6lVomfjtcUGMaWQLcAEJXIwDKhdQFX6SN8soBnkKirRUlSgD95DTGGlJGWenv-1Ir3_aRUXYxlLjMWbxnBM_Fei4TtozkR_eLjl5879HdbmB6qwh-5KAvWRU8YRRIo0j7K1ytBxrKtEH32fWqLYpb4MPHS1K3QFAVgXfDdfk-1PaGZryriCXL22S1gA-5cPbXxPvE0LYWycsCmUYFSHrKg",
        status: "Trực tuyến",
    },
];

export const userData = {
    name: "Komorebi",
    title: "Người bảo vệ rừng xanh",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKO3NcUUT9Ts-_ErM6wnIUd1MxKV9fXhf30YSdR24XNeEhzDXtKj3sRAPhqA68KvV-NrSYwYF4P_uOpGfwOhtCposCmVuOG1dcY0nAAflmt8FhHcHVZd5dQljb4xgVdsCyLa6a9wuqsLn7Z_UKHrnyFzvKekyrt-8bc0QAr1qiapbtparkDdbrdro6Rj3yYMZ87sXY5VrRoh7rBWqpTzlHMSpz8nJnFaTCZCB8XQZbROIldnpskTIpwiQgqo8xnbshULTcTfJg2MQ",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXksRxTWMdPMdx7gh9O5fyoQeyi1ZZulJyHjxujKXxeAT3iW3Apm_o5BF9VUt2QtF4jdewl9fxDLNEP9mKjnV10c41PyrK9JkzTRyQtKLzbhO3qcaMxSQn9luFAfT62pc-DTjNgRCisl6ygSVK7KGw6H56pwAUOA-URWHjR2UibwGREVdhuTNOS8FxNaCL8BywAm3RwkSf-8trTRN56ZdCJ9S38sKhlTbs6ZtVLDQoKj0omJo8tbX4xedfsiRzdoavrdd9iI77Tq0",
    email: "komorebi@forest.sanctuary",
    bio: "Yêu những tia nắng xuyên qua kẽ lá, trà ấm và những cuộc trò chuyện chân thành.",
    location: "Khu vườn bí mật",
};

export const initialNotifications = [
    {
        id: 1,
        title: "Lời mời tụ họp",
        desc: "Satsuki đã gửi cho bạn một lời mời tham gia phòng trò chuyện 'Đền Cổ'.",
        time: "10 phút trước",
        isUnread: true,
        icon: "spa",
    },
    {
        id: 2,
        title: "Hạt sồi may mắn",
        desc: "Mei vừa tặng bạn 3 quả thông vàng như một món quà gặp mặt.",
        time: "2 giờ trước",
        isUnread: false,
        icon: "filter_vintage",
    },
];