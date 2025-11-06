import React, { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [form, setForm] = useState({username:'', password:'', email:'', givenName:'', familyName:'', prefLocation:''});
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    const res = await signup(form);
    if(res.message){ alert(res.message); navigate("/confirm"); }
    else alert(JSON.stringify(res));
  }

  function update(field, val){ setForm({...form, [field]: val}); }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-96 space-y-2">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <input placeholder="Username" value={form.username} onChange={e=>update('username', e.target.value)} className="border p-2 w-full"/>
        <input type="password" placeholder="Password" value={form.password} onChange={e=>update('password', e.target.value)} className="border p-2 w-full"/>
        <input placeholder="Email" value={form.email} onChange={e=>update('email', e.target.value)} className="border p-2 w-full"/>
        <input placeholder="First Name" value={form.givenName} onChange={e=>update('givenName', e.target.value)} className="border p-2 w-full"/>
        <input placeholder="Last Name" value={form.familyName} onChange={e=>update('familyName', e.target.value)} className="border p-2 w-full"/>
        <input placeholder="Preferred Location" value={form.prefLocation} onChange={e=>update('prefLocation', e.target.value)} className="border p-2 w-full"/>
        <button className="bg-green-500 text-white p-2 w-full rounded">Sign Up</button>
      </form>
    </div>
  );
}
