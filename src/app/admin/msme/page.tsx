"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/AdminNavbar";
import Sidebar from "@/components/AdminSidebar";

interface MSME {
  id: number;
  name: string;
  description: string;
}

export default function ManageMSMEs() {
  const [msmes, setMsmes] = useState<MSME[]>([
    { id: 1, name: "Product name", description: "Lorem ipsum dolor sit amet" },
    { id: 2, name: "Product name", description: "Nisi reprehenderit" },
    { id: 3, name: "Product name", description: "Laborum mollit ex" },
    { id: 4, name: "Product name", description: "Magna culpa sunt" },
    { id: 5, name: "Product name", description: "Magna deserunt" },
    { id: 6, name: "Content", description: "Content" },
  ]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
        <Navbar />
        <div className="p-6">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Registered MSMEs
            </h2>
            <div className="mb-6 flex items-center justify-between">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              <button className="text-brown-800 flex items-center rounded-md bg-amber-200 px-4 py-2 transition duration-150 ease-in-out hover:bg-amber-300">
                <Plus size={18} className="mr-2" />
                Add MSME
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="pb-2">Enterprises</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {msmes.map((msme) => (
                    <tr key={msme.id} className="border-b last:border-b-0">
                      <td className="py-3">
                        <div className="font-medium">{msme.name}</div>
                        <div className="text-sm text-gray-500">
                          {msme.description}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <button className="mr-2 text-blue-500 hover:text-blue-700">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing 1 to 6 of 6 entries
              </div>
              <div className="flex items-center">
                <button className="mr-2 rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300">
                  <ChevronLeft size={18} />
                </button>
                <button className="text-brown-800 rounded-md bg-amber-200 p-2">
                  1
                </button>
                <button className="ml-2 rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
