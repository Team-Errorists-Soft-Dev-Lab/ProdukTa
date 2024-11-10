"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/AdminNavbar";
import Sidebar from "@/components/AdminSidebar";

interface Enterprise {
  id: number;
  name: string;
  location: string;
  contactPerson: string;
  phone: string;
  date: Date;
}

const municipalities = [
  "Ajuy",
  "Alimodian",
  "Anilao",
  "Badiangan",
  "Balasan",
  "Banate",
  "Barotac Nuevo",
  "Barotac Viejo",
  "Batad",
  "Bingawan",
  "Cabatuan",
  "Calinog",
  "Carles",
  "Concepcion",
  "Dingle",
  "Duenas",
  "Dumangas",
  "Estancia",
  "Guimbal",
  "Igbaras",
];

const ITEMS_PER_PAGE = 2;

export default function BambooSector() {
  const [enterprises] = useState<Enterprise[]>([
    {
      id: 1,
      name: "Tita's Bamboo Handicrafts Manufacturing",
      location: "Ajuy",
      contactPerson: "Tita T. Anotilla",
      phone: "09678638427",
      date: new Date("2023-01-15"),
    },
    {
      id: 2,
      name: "Trogani Bamboo Products Manufacturing",
      location: "Alimodian",
      contactPerson: "Marilyn T. Trogani",
      phone: "09197704975",
      date: new Date("2023-02-20"),
    },
    {
      id: 3,
      name: "Candelaria Cresta Bamboo Products Mftg.",
      location: "Anilao",
      contactPerson: "Candelaria C. Cresta",
      phone: "09303994788",
      date: new Date("2023-03-10"),
    },
    {
      id: 12,
      name: "Panay Bamboo Innovators",
      location: "Badiangan",
      contactPerson: "Bambi Bamboo",
      phone: "09321098765",
      date: new Date("2023-12-19"),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEnterprises = useMemo(() => {
    return enterprises.filter(
      (enterprise) =>
        (selectedLocation === "All" ||
          enterprise.location === selectedLocation) &&
        enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [enterprises, selectedLocation, searchTerm]);

  const totalPages = Math.ceil(filteredEnterprises.length / ITEMS_PER_PAGE);
  const paginatedEnterprises = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEnterprises.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEnterprises, currentPage]);

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
              Bamboo Sector
            </h1>
            <div className="flex w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search by name"
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
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 focus:outline-none focus:ring-amber-500"
              >
                <option value="All">All Locations</option>
                {municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 space-y-4">
              {paginatedEnterprises.map((enterprise) => (
                <div
                  key={enterprise.id}
                  className="rounded-lg border border-[#996439] bg-white p-4 shadow-md"
                >
                  <h3 className="mb-2 text-lg font-semibold">
                    {enterprise.name}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <p className="text-sm text-gray-600">
                      <strong>Location:</strong> {enterprise.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Contact Person:</strong>{" "}
                      {enterprise.contactPerson}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Phone:</strong> {enterprise.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong>{" "}
                      {enterprise.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredEnterprises.length,
                  )}{" "}
                  of {filteredEnterprises.length} entries
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
