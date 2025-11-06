import React, { useState } from "react";
import { confirmUser, resendConfirmation } from "../api";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    if (!username || !code) {
      setMessage("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await confirmUser({ username, confirmationCode: code });
      if (res.message) {
        setMessage(res.message);
        setTimeout(() => navigate("/"), 1000);
      } else if (res.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        setMessage("Unexpected response.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to confirm. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setResendMessage("");
    if (!username) {
      setResendMessage("Enter your username first.");
      return;
    }

    try {
      const res = await resendConfirmation({ username });
      setResendMessage(res.message || JSON.stringify(res));
    } catch (err) {
      console.error(err);
      setResendMessage("Failed to resend confirmation code.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">Confirm Account</h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>

        {message && <p className="text-sm text-center text-gray-700">{message}</p>}

        <button
          type="button"
          onClick={resend}
          className="text-sm underline text-center mt-2"
        >
          Resend Code
        </button>
        {resendMessage && <p className="text-sm text-center text-gray-700">{resendMessage}</p>}
      </form>
    </div>
  );
}
