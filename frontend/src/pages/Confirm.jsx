import React, { useState } from "react";
import { confirmUser, resendConfirmation } from "../api";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    const res = await confirmUser({username, confirmationCode: code});
    if(res.message){ alert(res.message); navigate("/home"); }
    else alert(JSON.stringify(res));
  }

  async function resend(){
    const res = await resendConfirmation({username});
    alert(res.message || JSON.stringify(res));
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-96 space-y-2">
        <h1 className="text-2xl font-bold">Confirm Account</h1>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className="border p-2 w-full"/>
        <input placeholder="Confirmation Code" value={code} onChange={e=>setCode(e.target.value)} className="border p-2 w-full"/>
        <button className="bg-blue-500 text-white p-2 w-full rounded">Confirm</button>
        <button type="button" onClick={resend} className="text-sm underline">Resend Code</button>
      </form>
    </div>
  );
}
