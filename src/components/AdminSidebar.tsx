import Link from "next/link";
import { Home, Users, FileText, User, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-[#f9f8f4] shadow-md">
      {
        <div className="p-4">
          <img
            src="/ProdukTa1.png" // Adjust to the actual file name and location
            alt="ProdukTa Logo"
            className="h-45 w-45 mx-auto"
          />
        </div>
      }
      <nav className="mt-8 flex-grow">
        <Link
          href="/admin/dashboard"
          className="text-brown-800 hover:border-color: [#996439]; flex items-center px-4 py-2 text-gray-700 hover:bg-[#996439] hover:text-[#FCFBFA]"
        >
          <Home className="mr-3" size={18} />
          Home
        </Link>
        <Link
          href="/admin/msme"
          className="text-brown-800 hover:border-color: [#996439]; flex items-center px-4 py-2 text-gray-700 hover:bg-[#996439] hover:text-[#FCFBFA]"
        >
          <Users className="mr-3" size={18} />
          Manage MSMEs
        </Link>
        <Link
          href="/admin/export-data"
          className="text-brown-800 hover:border-color: [#996439]; flex items-center px-4 py-2 text-gray-700 hover:bg-[#996439] hover:text-[#FCFBFA]"
        >
          <FileText className="mr-3" size={18} />
          Export Data
        </Link>
        <Link
          href="/guest"
          className="text-brown-800 hover:border-color: [#996439]; flex items-center px-4 py-2 text-gray-700 hover:bg-[#996439] hover:text-[#FCFBFA]"
        >
          <User className="mr-3" size={18} />
          Guest Mode
        </Link>
      </nav>
      <div className="p-4">
        <button className="bg-custom flex w-full items-center justify-center rounded bg-[#996439] px-4 py-2 text-[#FCFBFA] transition duration-150 ease-in-out hover:bg-[#bb987a]">
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
