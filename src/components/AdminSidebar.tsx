import Link from "next/link";
import { Home, Users, FileText, User, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-orange-50 shadow-md">
      <div className="p-4">
        <img
          src="/placeholder.svg?height=100&width=100"
          alt="ProdukTa Logo"
          className="mx-auto h-24 w-24"
        />
        <h1 className="text-brown-600 mt-2 text-center text-2xl font-bold">
          ProdukTa
        </h1>
      </div>
      <nav className="mt-8 flex-grow">
        <Link
          href="/"
          className="hover:text-brown-800 flex items-center px-4 py-2 text-gray-700 hover:bg-amber-200"
        >
          <Home className="mr-3" size={18} />
          Home
        </Link>
        <Link
          href="/manage"
          className="hover:text-brown-800 flex items-center px-4 py-2 text-gray-700 hover:bg-amber-200"
        >
          <Users className="mr-3" size={18} />
          Manage MSMEs
        </Link>
        <Link
          href="/export"
          className="hover:text-brown-800 flex items-center px-4 py-2 text-gray-700 hover:bg-amber-200"
        >
          <FileText className="mr-3" size={18} />
          Export Data
        </Link>
        <Link
          href="/guest"
          className="hover:text-brown-800 flex items-center px-4 py-2 text-gray-700 hover:bg-amber-200"
        >
          <User className="mr-3" size={18} />
          Guest Mode
        </Link>
      </nav>
      <div className="p-4">
        <button className="text-brown-800 flex w-full items-center justify-center rounded bg-amber-200 px-4 py-2 transition duration-150 ease-in-out hover:bg-amber-300">
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
