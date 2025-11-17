import React from "react";

export default function ChatSideBar({ users, selectedUser, setSelectedUser, messages }) {
  return (
    <div className="w-72 border-r border-gray-300 bg-white flex flex-col">
      <h2 className="p-4 text-xl font-bold border-b border-gray-300">
        Chats
      </h2>
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => {
          // Get the last message between current user and this partner
          const lastMessage = messages
            .filter(
              (msg) =>
                msg.senderId === user.id || msg.partnerId === user.id
            )
            .slice(-1)[0];

          return (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 ${
                selectedUser?.id === user.id ? "bg-blue-100" : ""
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium">{user.name}</div>
                {lastMessage && (
                  <div className="text-sm text-gray-600 truncate">
                    {lastMessage.message}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
