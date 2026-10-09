"use client";

import React, { useState } from "react";
import { BsCamera, BsLock, BsPencil } from "react-icons/bs";

const ProfileArea: React.FC = () => {
  const [displayName, setDisplayName] = useState("John Doe");
  const [bio, setBio] = useState("Available for new projects. Minimalist at heart.\nLove designing clean user experiences. ☕");

  return (
    <div className="flex-1 flex flex-col items-center bg-white h-full relative p-8 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#f8f9fa] rounded-3xl p-10 flex flex-col items-center m-auto">
        
        {/* Avatar Section */}
        <div className="relative mb-4 mt-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200">
            <img 
              src="https://i.pravatar.cc/150?img=11" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0d5e3d] rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-opacity-90 transition shadow-sm">
            <BsCamera size={14} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">John Doe</h2>
        <p className="text-sm text-gray-500 mb-10">+1 (555) 000-1234</p>

        {/* Form Section */}
        <div className="w-full space-y-6">
          {/* Display Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#0d5e3d] uppercase tracking-wider">
              Display Name
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-white text-gray-800 text-sm rounded-xl py-3.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#0d5e3d] pr-10 border border-gray-100 shadow-sm"
              />
              <BsLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            </div>
          </div>

          {/* About / Bio */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-[#0d5e3d] uppercase tracking-wider">
                About / Bio
              </label>
              <span className="text-[10px] text-gray-400">
                Up to 150 characters
              </span>
            </div>
            <div className="relative">
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-white text-gray-800 text-sm rounded-xl py-3.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#0d5e3d] pr-10 border border-gray-100 shadow-sm resize-none leading-relaxed"
              />
              <BsPencil className="absolute right-4 top-4 text-gray-400 cursor-pointer hover:text-gray-600 transition" size={14} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full bg-[#e6f0ec] rounded-xl p-3 flex justify-center gap-4 mt-12">
          <button className="px-10 py-2.5 bg-white text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition shadow-sm">
            Cancel
          </button>
          <button className="px-10 py-2.5 bg-[#0d5e3d] text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition shadow-sm">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileArea;
