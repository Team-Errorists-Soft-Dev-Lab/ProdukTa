"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="bg-[#996439] shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold text-[#FCFBFA]">
          Admin Dashboard
        </h2>
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#BB987A] font-bold text-[#FCFBFA]">
              {userInitial}
            </div>
            <span className="font-bold text-[#FCFBFA]">
              {user?.name ?? "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
