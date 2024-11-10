"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/AdminNavbar";
import Sidebar from "@/components/AdminSidebar";
import {
  bambooMSMEs,
  coconutMSMEs,
  coffeeMSMEs,
  weavingMSMEs,
  foodMSMEs,
} from "@/lib/mock-data";

const ITEMS_PER_PAGE = 4;

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allMSMEs = [
    ...bambooMSMEs,
    ...coconutMSMEs,
    ...coffeeMSMEs,
    ...weavingMSMEs,
    ...foodMSMEs,
  ];

  const filteredMSMEs = useMemo(() => {
    return allMSMEs.filter(
      (msme) =>
        msme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msme.address.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredMSMEs.length / ITEMS_PER_PAGE);
  const paginatedMSMEs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMSMEs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMSMEs, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden bg-gray-100">
        <Navbar />
        <div className="p-4 md:p-6">
          <div className="rounded-lg border border-[#996439] bg-white p-4 shadow-lg md:p-6">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              MSME Dashboard
            </h1>
            <div className="flex w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search by name or location"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {paginatedMSMEs.map((msme) => (
                <div
                  key={msme.id}
                  className="rounded-lg border border-[#996439] bg-white p-4 shadow-md"
                >
                  <h3 className="mb-2 text-lg font-semibold">{msme.name}</h3>
                  <div className="flex flex-wrap gap-4">
                    <p className="text-sm text-gray-600">
                      <strong>Location:</strong> {msme.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {msme.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Phone:</strong> {msme.contactNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredMSMEs.length)}{" "}
                  of {filteredMSMEs.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-md px-3 py-1 ${
                          currentPage === page
                            ? "text-brown-800 bg-amber-200"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
