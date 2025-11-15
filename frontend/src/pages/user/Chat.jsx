import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatSideBar from "../../components/ChatSideBar";
import ChatThread from "../../components/ChatThread";

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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

  // Fetch all chat partners for the current user
  useEffect(() => {
    const fetchAllChats = async () => {
      if (!idToken || !currentUserId) return;

      try {
        const response = await fetch(
          `https://i94mrsytqk.execute-api.us-west-2.amazonaws.com/prod/user/chat/getAllChats`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        const data = await response.json();

        // Dynamo might return an array of partner IDs or objects
        // For now, create random names and avatars
        // TODO: read from user table
        const partnerUsers = Array.isArray(data)
          ? data.map((partnerId, idx) => ({
              id: partnerId,
              name: `User ${idx + 1}`,
              avatar: `https://i.pravatar.cc/150?img=${Math.floor(
                Math.random() * 70
              ) + 1}`,
            }))
          : [];

        setUsers(partnerUsers);

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
    <div className="flex h-[calc(100vh-3rem)]">
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
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p>Loading chat...</p>
        </div>
      )}
    </div>
  );
}

export default Chat;
