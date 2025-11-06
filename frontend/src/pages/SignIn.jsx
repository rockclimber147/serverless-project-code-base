import React, { useState } from "react";
import { signin, parseJwt } from "../api";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    const res = await signin({ username, password });
    if(res.idToken){
      localStorage.setItem("idToken", res.idToken);
      const claims = parseJwt(res.idToken);
      localStorage.setItem("userId", claims.sub);
      navigate("/home");
    } else { alert(JSON.stringify(res)); }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <input className="border p-2 mb-2 w-full" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)}/>
        <input type="password" className="border p-2 mb-2 w-full" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button className="bg-blue-500 text-white p-2 w-full rounded">Sign In</button>
      </form>
    </div>
  );
}
