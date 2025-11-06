import React, { useState } from "react";
import { signin, parseJwt } from "../api";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    console.log("Submitting:", { username, password }); // debug

    try {
      const res = await signin({ username, password });
      console.log("Response:", res);

      if (res.idToken) {
        localStorage.setItem("idToken", res.idToken);
        const claims = parseJwt(res.idToken);
        localStorage.setItem("userId", claims.sub);
        navigate("/home");
      } else {
        alert(JSON.stringify(res));
      }
    } catch (err) {
      console.error("Error signing in:", err);
      alert("Sign-in failed. Check console for details.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>

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
