// implement export data page here
"use client";
import { useState, useEffect } from "react";
import { Search, Calendar, Filter } from "lucide-react";
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
  category: string;
  date: Date;
}

const categories = [
  "All",
  "Bamboo",
  "Coffee & Cacao",
  "Coconut",
  "Processed Foods",
  "Coco",
  "Weaving",
  "IT - BPM",
];

export default function ExportData() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([
    {
      id: 1,
      name: "Tita's Bamboo Handicrafts Manufacturing",
      location: "San Rafael, Tigubaun, Iloilo",
      contactPerson: "Tita T. Anotilla",
      phone: "09678638427",
      category: "Bamboo",
      date: new Date("2023-01-15"),
    },
    {
      id: 2,
      name: "Trogani Bamboo Products Manufacturing",
      location: "Catablan, Tigubaun, Iloilo",
      contactPerson: "Marilyn T. Trogani",
      phone: "09197704975",
      category: "Bamboo",
      date: new Date("2023-02-20"),
    },
    {
      id: 3,
      name: "Candelaria Cresta Bamboo Products Mftg.",
      location: "Bgy. Norte, Leon, Iloilo",
      contactPerson: "Candelaria C. Cresta",
      phone: "09303994788",
      category: "Bamboo",
      date: new Date("2023-03-10"),
    },
    {
      id: 4,
      name: "L and J Native Products",
      location: "Malitbog, Zaragoza, Iloilo",
      contactPerson: "Luci B. Aguro",
      phone: "09772426876",
      category: "Weaving",
      date: new Date("2023-04-05"),
    },
    {
      id: 5,
      name: "Iloilo Coffee Roasters",
      location: "Jaro, Iloilo City",
      contactPerson: "Juan Dela Cruz",
      phone: "09123456789",
      category: "Coffee & Cacao",
      date: new Date("2023-05-12"),
    },
    {
      id: 6,
      name: "Coconut Haven",
      location: "Tigbauan, Iloilo",
      contactPerson: "Maria Santos",
      phone: "09987654321",
      category: "Coconut",
      date: new Date("2023-06-18"),
    },
    {
      id: 7,
      name: "Ilonggo Delicacies",
      location: "La Paz, Iloilo City",
      contactPerson: "Pedro Penduko",
      phone: "09876543210",
      category: "Processed Foods",
      date: new Date("2023-07-22"),
    },
    {
      id: 8,
      name: "Coco Crafts Iloilo",
      location: "Oton, Iloilo",
      contactPerson: "Coco Dela Coco",
      phone: "09765432109",
      category: "Coco",
      date: new Date("2023-08-30"),
    },
    {
      id: 9,
      name: "Hablon Weavers Association",
      location: "Miagao, Iloilo",
      contactPerson: "Habi Hablon",
      phone: "09654321098",
      category: "Weaving",
      date: new Date("2023-09-14"),
    },
    {
      id: 10,
      name: "Iloilo Tech Solutions",
      location: "Mandurriao, Iloilo City",
      contactPerson: "Tech Techie",
      phone: "09543210987",
      category: "IT - BPM",
      date: new Date("2023-10-25"),
    },
    {
      id: 11,
      name: "Guimaras Mango Processors",
      location: "Jordan, Guimaras",
      contactPerson: "Mango Mango",
      phone: "09432109876",
      category: "Processed Foods",
      date: new Date("2023-11-08"),
    },
    {
      id: 12,
      name: "Panay Bamboo Innovators",
      location: "Pavia, Iloilo",
      contactPerson: "Bambi Bamboo",
      phone: "09321098765",
      category: "Bamboo",
      date: new Date("2023-12-19"),
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState<Date>(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date("2023-12-31"),
  );
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [timeRange, setTimeRange] = useState("custom");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEnterprises, setSelectedEnterprises] = useState<number[]>([]);

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
    const matchesCategory =
      selectedCategory === "All" || enterprise.category === selectedCategory;
    const matchesSearch = enterprise[filterType as keyof Enterprise]
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDateRange =
      (!startDate || enterprise.date >= startDate) &&
      (!endDate || enterprise.date <= endDate);
    return matchesCategory && matchesSearch && matchesDateRange;
  });

  const toggleEnterpriseSelection = (id: number) => {
    setSelectedEnterprises((prev) =>
      prev.includes(id) ? prev.filter((eId) => eId !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
        <Navbar />
        <div className="p-6">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="relative w-64">
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
              <button className="rounded-md bg-[#996439] px-4 py-2 text-[#FCFBFA] transition duration-150 ease-in-out hover:bg-[#bb987a]">
                Export Data
              </button>
            </div>
            {showFilters && (
              <div className="mb-4 rounded-md bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">Filters</h3>
                <div className="flex space-x-4">
                  <div>
                    <label
                      htmlFor="filterType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Filter by
                    </label>
                    <select
                      id="filterType"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                    >
                      <option value="name">Name</option>
                      <option value="category">Category</option>
                      <option value="location">Location</option>
                      <option value="contactPerson">Contact Person</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <label
                    htmlFor="timeRange"
                    className="border-color: [#996439] block text-sm font-medium text-gray-700"
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
                      onChange={(date: Date | null) =>
                        setEndDate(date ?? undefined)
                      }
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
                      onChange={(date: Date | null) =>
                        setEndDate(date ?? undefined)
                      }
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
              <div>
                <label
                  htmlFor="itemsPerPage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Items per page:
                </label>
                <input
                  type="number"
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                />
              </div>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              List of Enterprises
            </h2>
            <div className="mb-4 flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    selectedCategory === category
                      ? "text-brown-800 bg-amber-200"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="w-8 pb-2"></th>
                    <th className="pb-2">NAME</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Contact Person</th>
                    <th className="pb-2">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnterprises
                    .slice(0, itemsPerPage)
                    .map((enterprise) => (
                      <tr
                        key={enterprise.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-3">
                          <input
                            title="search"
                            type="checkbox"
                            checked={selectedEnterprises.includes(
                              enterprise.id,
                            )}
                            onChange={() =>
                              toggleEnterpriseSelection(enterprise.id)
                            }
                            className="form-checkbox h-5 w-5 text-amber-600"
                          />
                        </td>
                        <td className="py-3">{enterprise.name}</td>
                        <td className="py-3">{enterprise.location}</td>
                        <td className="py-3">{enterprise.contactPerson}</td>
                        <td className="py-3">{enterprise.phone}</td>
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
