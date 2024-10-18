import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-amber-200 shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-brown-800 text-xl font-semibold">Dashboard</h2>
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="text-brown-600 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-bold">
              U
            </div>
            <span className="text-brown-800">User Name</span>
          </div>
        </div>
      </div>
    </header>
  );
}
