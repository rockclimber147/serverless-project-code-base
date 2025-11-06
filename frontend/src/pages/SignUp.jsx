import React, { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    givenName: "",
    familyName: "",
    prefLocation: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  function update(field, val) {
    setForm({ ...form, [field]: val });
  }

  async function submit(e) {
    e.preventDefault();
    setErrorMsg(""); // clear previous errors

    // Basic validation
    if (
      !form.username ||
      !form.password ||
      !form.email ||
      !form.givenName ||
      !form.familyName
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      const res = await signup(form);

      if (res.message) {
        // Redirect to confirmation page
        navigate("/confirm");
      } else if (res.error) {
        setErrorMsg(res.error);
      } else {
        setErrorMsg("Sign-up failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Sign-up failed. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-3"
      >
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        {errorMsg && (
          <div className="text-red-600 bg-red-100 p-2 rounded">{errorMsg}</div>
        )}

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => update("username", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="First Name"
          value={form.givenName}
          onChange={(e) => update("givenName", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Last Name"
          value={form.familyName}
          onChange={(e) => update("familyName", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Preferred Location"
          value={form.prefLocation}
          onChange={(e) => update("prefLocation", e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
