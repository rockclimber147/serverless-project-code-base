import React, { useState } from "react";
import { signin, parseJwt } from "@/services/authApi"
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // For inline error messages
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErrorMsg(""); // clear previous errors

    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    try {
      const res = await signin({ username, password });

      if (res.idToken) {
        localStorage.setItem("idToken", res.idToken);
        const claims = parseJwt(res.idToken);
        localStorage.setItem("userId", claims.sub);
        navigate("/"); // redirect to home page
      } else if (res.error) {
        setErrorMsg(res.error);
      } else {
        setErrorMsg("Sign-in failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Sign-in failed. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>

        {errorMsg && (
          <div className="text-red-600 bg-red-100 p-2 rounded">{errorMsg}</div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-blue-500 hover:underline mt-2"
        >
          Don't have an account? Sign Up
        </button>
      </form>
    </div>
  );
}
