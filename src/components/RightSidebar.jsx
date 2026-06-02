import React from "react";
import AddMemberModal from "./AddMemberModel";
import ViewMembersModal from "./ViewMembersModal";

export default function RightSidebar({
  onClose,
  currentActiveChat,
  members,
  isAddMemberOpen,
  setIsAddMemberOpen,
  isViewMembersOpen,
  setIsViewMembersOpen,
  friendsAvailableToAdd,
  handleAddMemberSubmit,
  handleLeaveGroupSubmit,
}) {
  return (
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
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840] hover:bg-[#f0eee8] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Avatar & Name */}
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

          {/* Quick Actions */}
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
            <div
              onClick={() => setIsViewMembersOpen(true)}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-[#b0e0f6]/10 flex items-center justify-center text-[#b0e0f6] group-hover:bg-[#b0e0f6]/20 transition-colors">
                <span className="material-symbols-outlined text-lg">badge</span>
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

        {/* Member List Short */}
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
              <div key={idx} className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 shrink-0">
                  <img
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                    src={member.avatarUrl || "https://i.pravatar.cc/100"}
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
                    {member.online ? "Đang hoạt động" : "Ngoại tuyến"}
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

        {/* Shared Media */}
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
  );
}
