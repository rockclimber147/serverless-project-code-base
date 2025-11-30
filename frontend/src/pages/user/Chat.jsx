import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatSideBar from "../../components/ChatSideBar";
import ChatThread from "../../components/ChatThread";
import { useLocation } from "react-router-dom";
import { fetchApiGet, getUserInfo } from "@/services/authApi"

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const partnerIdFromNav = location.state?.partnerId;
  const partnerNameFromNav = location.state?.partnerName;
  const partnerAvatarFromNav = location.state?.avatar;
  const itemFromNav = location.state?.item;
  const defaultAvatar = "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8=";

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("idToken");

    if (!storedId || !storedToken) {
      navigate("/");
      return;
    }

    setCurrentUserId(storedId);
    setIdToken(storedToken);
  }, [navigate]);

  useEffect(() => {
    if (partnerIdFromNav && !users.find((u) => u.id === partnerIdFromNav)) {
      setUsers((prev) => [
        ...prev,
        {
          id: partnerIdFromNav,
          name: partnerNameFromNav || "User",
          avatar: partnerAvatarFromNav || defaultAvatar,
        },
      ]);
      setSelectedUser({
        id: partnerIdFromNav,
        name: partnerNameFromNav || "User",
        avatar: partnerAvatarFromNav || defaultAvatar,
      });
    }
  }, [partnerIdFromNav]);

  // Fetch all chat partners for the current user
  useEffect(() => {
    const fetchAllChats = async () => {
      if (!idToken || !currentUserId) return;

      try {
        const response = await fetchApiGet("/user/chat/getAllChats", idToken);
        if (response.status === 401) {
            localStorage.removeItem("idToken");
            localStorage.removeItem("userId");
            navigate("/");
            return;
        }

        const data = await response.json();

        const partnerUsers = Array.isArray(data)
          ? await Promise.all(
            data.map(async (partnerId) => {
            const res = await getUserInfo({id: partnerId}, idToken);
            const user = res.data;
            return ({
              id: partnerId,
              name: `${user?.givenName} ${user?.familyName}` || "User",
              avatar: user?.profileImage || defaultAvatar,
            })
          })) : [];

        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const merged = [
            ...prev,
            ...partnerUsers.filter((u) => !existingIds.has(u.id)),
          ];
          return merged;
        });

        // Set the first user as selected by default
        if (partnerUsers.length > 0 && !selectedUser) {
          setSelectedUser(partnerUsers[0]);
        }
      } catch (err) {
        console.error("Failed to fetch chat partners:", err);
      }
    };

    fetchAllChats();
  }, [idToken, currentUserId]);

  return (
    <div className="flex h-screen pt-14">
      <ChatSideBar
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        messages={messages}
      />

      {currentUserId && idToken && selectedUser ? (
        <ChatThread
          messages={messages}
          setMessages={setMessages}
          user={selectedUser}
          currentUserId={currentUserId}
          idToken={idToken}
          item={itemFromNav}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-green-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-green-700 font-medium">Loading chat...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
