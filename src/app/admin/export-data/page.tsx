"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const mockData: Enterprise[] = [
  {
    id: 1,
    name: "Tita's Bamboo Handicrafts Manufacturing",
    location: "San Rafael, Tigubaun, Iloilo",
    contactPerson: "Tita T. Anotilla",
    phone: "09678638427",
    date: new Date("2023-01-15"),
  },
  {
    id: 2,
    name: "Trogani Bamboo Products Manufacturing",
    location: "Catablan, Tigubaun, Iloilo",
    contactPerson: "Marilyn T. Trogani",
    phone: "09197704975",
    date: new Date("2023-02-20"),
  },
  {
    id: 3,
    name: "Candelaria Cresta Bamboo Products Mftg.",
    location: "Bgy. Norte, Leon, Iloilo",
    contactPerson: "Candelaria C. Cresta",
    phone: "09303994788",
    date: new Date("2023-03-10"),
  },
  {
    id: 4,
    name: "Association of Differently-abled Persons in Iloilo MPC",
    location: "Lapayon, Leganes, Iloilo",
    contactPerson: "John Doe",
    phone: "09123456789",
    date: new Date("2023-04-05"),
  },
  {
    id: 5,
    name: "L and J Native Products",
    location: "Malunang, Zarraga, Iloilo",
    contactPerson: "Jane Smith",
    phone: "09987654321",
    date: new Date("2023-05-12"),
  },
  {
    id: 6,
    name: "Alimodian Bamboo Producers Association",
    location: "Lapayon, Leganes, Iloilo",
    contactPerson: "Mark Johnson",
    phone: "09876543210",
    date: new Date("2023-06-18"),
  },
  {
    id: 7,
    name: "Maasin Kawayan MPC",
    location: "Poblacion, Maasin, Iloilo",
    contactPerson: "Emily Brown",
    phone: "09765432109",
    date: new Date("2023-07-22"),
  },
  {
    id: 8,
    name: "Efren's Bamboo Crafts Manufacturing",
    location: "Jibolo, Janiuay, Iloilo",
    contactPerson: "Efren Garcia",
    phone: "09654321098",
    date: new Date("2023-08-30"),
  },
  {
    id: 9,
    name: "JVM Bamboo Furniture Manufacturing",
    location: "Bantayan, San Enrique, Iloilo",
    contactPerson: "Victor Martinez",
    phone: "09543210987",
    date: new Date("2023-09-14"),
  },
  {
    id: 10,
    name: "Mr. Hobby Pottery and Bamboo Shop",
    location: "Haguimitan, Passi City, Iloilo",
    contactPerson: "Robert Lee",
    phone: "09432109876",
    date: new Date("2023-10-25"),
  },
  {
    id: 11,
    name: "Alegria Bamboo Craft Association",
    location: "Alegria, Dingle, Iloilo",
    contactPerson: "Maria Santos",
    phone: "09321098765",
    date: new Date("2023-11-08"),
  },
  {
    id: 12,
    name: "Panay Bamboo Innovators",
    location: "Pavia, Iloilo",
    contactPerson: "Bambi Bamboo",
    phone: "09321098765",
    date: new Date("2023-12-19"),
  },
];

export default function BambooSector() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(mockData);
  const [startDate, setStartDate] = useState<Date>(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date("2023-12-31"),
  );
  const [timeRange, setTimeRange] = useState("custom");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEnterprises, setSelectedEnterprises] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (timeRange === "month-to-date") {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(firstDayOfMonth);
      setEndDate(now);
    }
  }, [timeRange]);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  const filteredEnterprises = enterprises.filter((enterprise) => {
    const matchesSearch = Object.values(enterprise).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const matchesDateRange =
      (!startDate || enterprise.date >= startDate) &&
      (!endDate || enterprise.date <= endDate);
    return matchesSearch && matchesDateRange;
  });

  const paginatedEnterprises = filteredEnterprises.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredEnterprises.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const toggleEnterpriseSelection = (id: number) => {
    setSelectedEnterprises((prev) =>
      prev.includes(id) ? prev.filter((eId) => eId !== id) : [...prev, id],
    );
  };

  const toggleAllEnterprises = () => {
    const currentPageIds = paginatedEnterprises.map(
      (enterprise) => enterprise.id,
    );
    const allSelected = currentPageIds.every((id) =>
      selectedEnterprises.includes(id),
    );

    if (allSelected) {
      setSelectedEnterprises((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      setSelectedEnterprises((prev) => [
        ...new Set([...prev, ...currentPageIds]),
      ]);
    }
  };

  const handleExportData = () => {
    const selectedData = enterprises.filter((enterprise) =>
      selectedEnterprises.includes(enterprise.id),
    );
    console.log("Exporting data:", selectedData);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden bg-gray-100">
        <Navbar />
        <div className="p-4 md:p-6">
          <div className="rounded-lg border border-[#996439] bg-white p-4 shadow-lg md:p-6">
            <div className="mb-6 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
              <h1 className="text-2xl font-bold text-gray-800">
                Bamboo Sector
              </h1>
              <div className="flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-4 md:space-y-0">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="absolute right-2 top-2 rounded-md p-1 hover:bg-gray-100"
                  >
                    <Filter size={18} className="text-gray-400" />
                  </button>
                </div>
                <button
                  onClick={handleExportData}
                  className="w-full rounded-md bg-[#996439] px-4 py-2 text-[#FCFBFA] transition duration-150 ease-in-out hover:bg-[#bb987a] md:w-auto"
                >
                  Export Data ({selectedEnterprises.length})
                </button>
              </div>
            </div>
            {showFilters && (
              <div className="mb-4 rounded-md bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">Filters</h3>
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                  <div>
                    <label
                      htmlFor="timeRange"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time Range
                    </label>
                    <select
                      id="timeRange"
                      value={timeRange}
                      onChange={handleTimeRangeChange}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                    >
                      <option value="custom">Custom</option>
                      <option value="month-to-date">Month to Date</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => {
                          if (date) setStartDate(date);
                        }}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-10 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                      />
                      <Calendar
                        className="absolute left-3 top-[60%] -translate-y-1/2 transform text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => {
                          if (date) setEndDate(date);
                        }}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-10 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                      />
                      <Calendar
                        className="absolute left-3 top-[60%] -translate-y-1/2 transform text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={paginatedEnterprises.every((enterprise) =>
                  selectedEnterprises.includes(enterprise.id),
                )}
                onChange={toggleAllEnterprises}
                className="mr-2 h-5 w-5 rounded text-[#996439] focus:ring-[#996439]"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All on This Page
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedEnterprises.map((enterprise) => (
                <div
                  key={enterprise.id}
                  className="rounded-lg border border-[#996439] bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{enterprise.name}</h3>
                    <input
                      type="checkbox"
                      checked={selectedEnterprises.includes(enterprise.id)}
                      onChange={() => toggleEnterpriseSelection(enterprise.id)}
                      className="h-5 w-5 rounded text-[#996439] focus:ring-[#996439]"
                    />
                  </div>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {enterprise.location}
                  </p>
                  <p>
                    <span className="font-semibold">Contact Person:</span>{" "}
                    {enterprise.contactPerson}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {enterprise.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {enterprise.date.toDateString()}
                  </p>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
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
