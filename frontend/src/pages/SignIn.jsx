import React, { useState } from "react";
import { signin, parseJwt } from "@/services/authApi";
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
        navigate("/user-dashboard-grid"); // redirect to dashboard
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
    <div className="auth-page flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Crocs<span className="text-green-300">List</span>
          </h2>
          <p className="text-green-200/70">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={submit}
          className="auth-card p-8 flex flex-col gap-5"
        >
          <div className="text-center mb-2">
            <h1 className="auth-title text-2xl">Welcome back</h1>
            <p className="auth-subtitle mt-1">Enter your credentials to continue</p>
          </div>

          {errorMsg && (
            <div className="auth-error">{errorMsg}</div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn-primary mt-2"
          >
            Sign In
          </button>

          <div className="auth-divider">or</div>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="auth-link"
            >
              Sign Up
            </button>
          </p>
        </form>

        {/* Back to home */}
        <p className="text-center mt-6 relative z-10">
          <button
            onClick={() => navigate("/")}
            className="text-green-200/70 hover:text-white transition text-sm"
          >
            ← Back to Home
          </button>
        </p>
      </div>
    </div>
  );
}
