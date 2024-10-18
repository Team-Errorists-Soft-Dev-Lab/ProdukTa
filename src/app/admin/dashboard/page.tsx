// implement admin homepage/dashboard
"use client";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Navbar from "@/components/AdminNavbar";
import Sidebar from "@/components/AdminSidebar";

interface Enterprise {
  name: string;
  location: string;
  email: string;
  phone: string;
}

export default function Dashboard() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([
    {
      name: "kulit lois aswang management",
      location: "antique flyers",
      email: "N/A",
      phone: "09678638427",
    },
    {
      name: "chito diwata pares overload",
      location: "edi tipaklong",
      email: "N/A",
      phone: "09197704975",
    },
    {
      name: "peyt peyt kumukulit kana",
      location: "kilid dorm ni lois",
      email: "N/A",
      phone: "09303994788",
    },
    {
      name: "buntis si laluma",
      location: "sakay shane ehh",
      email: "N/A",
      phone: "09772426876",
    },
  ]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
        <Navbar />
        <div className="p-6">
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Registered MSMEs
                </h3>
                <p className="text-brown-600 text-3xl font-bold">1498</p>
              </div>
              <button className="text-brown-800 rounded bg-amber-200 px-4 py-2 transition duration-150 ease-in-out hover:bg-amber-300">
                Export Data
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                List of Enterprises
              </h3>
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="rounded-md border py-2 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <Search
                    className="absolute left-2 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
                <button className="ml-2 flex items-center rounded bg-gray-200 px-4 py-2 transition duration-150 ease-in-out hover:bg-gray-300">
                  Sort by <ChevronDown className="ml-1" size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Phone</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {enterprises.map((enterprise, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-2">{enterprise.name}</td>
                      <td className="py-2">{enterprise.location}</td>
                      <td className="py-2">{enterprise.email}</td>
                      <td className="py-2">{enterprise.phone}</td>
                      <td className="py-2">
                        <button className="text-blue-500 hover:underline">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
