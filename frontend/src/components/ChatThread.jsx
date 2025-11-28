import React, { useState, useRef, useEffect } from "react";
import { fetchApiGet, fetchApiPost } from "@/services/authApi"
import { ListingCRUDAPIService } from "@/services/listingsUser";
import { useNavigate } from "react-router-dom";

function ChatThread({ messages, setMessages, user, currentUserId, idToken, item }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || !idToken) return;

    try {
      const body = { partnerId: user.id, message: input };
      const response = await fetchApiPost("/user/chat/sendMessage", body, idToken);

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
      const endpoint = `/user/chat/getMessages?partnerId=${user.id}`;
      const response = await fetchApiGet(endpoint, idToken);
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

  useEffect(() => {
    const sendItemCard = async () => {
      if (!item || !idToken || !user) return;

      const body = {
        partnerId: user.id,
        message: JSON.stringify({
          type: "itemCard",
          item: item
        })
      };

      try {
        const response = await fetchApiPost("/user/chat/sendMessage", body, idToken);
        const data = await response.json();
        if (data.ok) {
          await handleRefresh();
        }
      } catch (err) {
        console.error("Send item card failed:", err);
      }
    };

    sendItemCard();
  }, [item, user]);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-300 flex items-center justify-between p-6">
        <div 
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => {
            navigate(`/view-seller-profile/${user.id}`, { state: { user } });
          }}>
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
            {(() => {
              let parsed = null;
              try {
                parsed = JSON.parse(msg.message);
              } catch {}
              console.log("MES:", msg.message);
              // If normal text message
              if (!parsed || !parsed.type) return msg.message;

              // ITEM CARD MESSAGE
              if (parsed.type === "itemCard") {
                const isSeller = msg.senderId === user.id; // recipient side
                return (
                  <div className="border rounded-lg bg-white text-black p-3 shadow-md w-64">
                    <img
                      src={parsed?.item?.image}
                      className="w-full h-32 object-cover rounded"
                      alt="item"
                    />

                    <div className="mt-2 font-semibold">{parsed?.item?.item_name}</div>
                    <div className="text-gray-600">${parsed?.item?.price}</div>

                    <button
                      className="mt-3 px-3 py-2 bg-blue-500 text-white rounded w-full"
                      onClick={() => navigate(`/item-details/${parsed?.item?.listing_id}`, { state: { item: item ?? parsed?.item } })}
                    >
                      View Item
                    </button>

                    {isSeller && (
                      <button
                        className="mt-2 px-3 py-2 bg-red-500 text-white rounded w-full"
                        onClick={async () => {
                          try {
                            await ListingCRUDAPIService.updateListing(parsed.item.listing_id, { is_sold: true });
                            console.log("Listing Updated");
                            const reviewMessage = {
                              type: "reviewRequest",
                              listing_id: parsed.item.listing_id,
                              item_name: parsed.item.item_name,
                              text: `Please rate your experience for "${parsed.item.item_name}":`,
                            };
                            
                            const messageBody = {
                              partnerId: user.id,
                              message: JSON.stringify(reviewMessage),
                            };
                            
                            await fetchApiPost("/user/chat/sendMessage", messageBody, idToken);
                            await handleRefresh();

                          } catch (err) {
                            console.error(err);
                            alert("An error occurred while updating the listing or sending review request.");
                          }
                        }}
                      >
                        Mark as Sold
                      </button>
                    )}
                  </div>
                );
              }
              if (parsed?.type === "reviewRequest") {
                return (
                  <div className="rounded-lg p-3 w-64">
                    <div className="font-semibold mb-2">{parsed.text}</div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          key={star}
                          className="text-gray-400 text-xl"
                          onClick={async () => {
                            try {
                              const ratingBody = {
                                partnerId: msg.senderId,
                                message: JSON.stringify({
                                  type: "review",
                                  listing_id: parsed.listing_id,
                                  rating: star,
                                  item_name: parsed.item_name,
                                })
                              };
                              await fetchApiPost("/user/chat/sendMessage", ratingBody, idToken);
                              console.log("ratingBody:", ratingBody);
                              await handleRefresh();
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          ☆
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
              if (parsed?.type === "review") {
                console.log(parsed);
                return (
                  <div className="rounded-lg p-3 w-48">
                    <div className="font-semibold">Buyer Rating for "{parsed.item_name}":</div>
                    <div className="text-yellow-500 text-xl">
                      {"★".repeat(parsed.rating)}
                      {"☆".repeat(5 - parsed.rating)}
                    </div>
                  </div>
                );
              }
            })()}
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
