import React, { useState, useRef, useEffect } from "react";

function ChatThread({ messages, setMessages, user, currentUserId, idToken }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || !idToken) return;

    try {
      const response = await fetch(
        `https://ardhu7a4ye.execute-api.us-west-2.amazonaws.com/prod/user/chat/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            partnerId: user.id,
            message: input,
          }),
        }
      );

      const data = await response.json();
      if (data.ok) {
        setInput("");
        await handleRefresh(); // refresh messages
      } else {
        console.error("Send message error:", data);
      }
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const handleRefresh = async () => {
    if (!idToken || !user) return;

    try {
      const response = await fetch(
        `https://ardhu7a4ye.execute-api.us-west-2.amazonaws.com/prod/user/chat/getMessages?partnerId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      scrollToBottom();
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (user) {
      handleRefresh();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-300 flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <h2 className="text-2xl font-bold">{user.name}</h2>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Refresh Chat
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg max-w-md ${
              msg.senderId === currentUserId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black mr-auto"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-6 border-t border-gray-300 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatThread;
