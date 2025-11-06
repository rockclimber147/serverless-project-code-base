import React, { useState } from "react";
import { uploadPhotoBase64, editUser, parseJwt } from "../api";

export default function EditProfile() {
  const [file, setFile] = useState(null);
  const [prefLocation, setPrefLocation] = useState("");
  const idToken = localStorage.getItem("idToken");
  const claims = parseJwt(idToken);
  const userId = claims?.sub;

  async function submit(e){
    e.preventDefault();
    if(!file) { alert("Choose a file first"); return; }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      const uploadRes = await uploadPhotoBase64({id:userId, filename:file.name, fileBase64:base64}, idToken);
      if(uploadRes.s3Url){
        const editRes = await editUser({id:userId, profileImage: uploadRes.s3Url, prefLocation}, idToken);
        alert(editRes.message || JSON.stringify(editRes));
      } else { alert(JSON.stringify(uploadRes)); }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <input type="file" onChange={e=>setFile(e.target.files[0])}/>
        <input placeholder="Preferred Location" value={prefLocation} onChange={e=>setPrefLocation(e.target.value)} className="border p-2 w-full"/>
        <button className="bg-blue-500 text-white p-2 w-full rounded">Save</button>
      </form>
    </div>
  );
}
