"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMSMEMock } from "@/contexts/MSMEMockContext"; // TODO: remove once proper CRUD operations are implemented

import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const ITEMS_PER_PAGE = 4;

export default function Dashboard() {
  const { sectors, msmes } = useMSMEMock();
  const { activeAdmins } = useSuperAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMSMEs = useMemo(() => {
    return msmes.filter(
      (msme) =>
        msme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msme.address.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [msmes, searchTerm]);

  const totalPages = Math.ceil(filteredMSMEs.length / ITEMS_PER_PAGE);
  const paginatedMSMEs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMSMEs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMSMEs, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const exportAnalytics = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Guest Exports",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Slightly less opaque for better layering
        borderColor: "rgb(16, 185, 129)", // emerald-500
        borderWidth: 3, // Thicker border for better definition
        hoverBackgroundColor: "rgba(16, 185, 129, 0.8)", // More opaque on hover
        hoverBorderColor: "rgb(16, 185, 129)", // Solid border on hover
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow height adjustment
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 20,
          padding: 15,
          color: "#4B5563", // Darker color for better readability
        },
      },
      title: {
        display: true,
        text: "Monthly Guest Data Exports",
        font: {
          size: 24, // Increased font size for better visibility
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          color: "#4B5563", // Darker color for better readability
        },
        grid: {
          color: "#E5E7EB", // Light gray grid lines
          lineWidth: 1, // Thinner grid lines for a cleaner look
        },
      },
      x: {
        grid: {
          color: "#E5E7EB", // Light gray grid lines
          lineWidth: 1, // Thinner grid lines for a cleaner look
        },
      },
    },
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Dashboard
        </h2>
        <p className="mt-1 text-center text-lg font-bold text-gray-600">
          Overview of MSMEs in Iloilo
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle className="text-center">Total Sectors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl font-bold text-emerald-600">
              {sectors.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle className="text-center">Total MSMEs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl font-bold text-emerald-600">
              {msmes.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle className="text-center">Active Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl font-bold text-emerald-600">
              {activeAdmins.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle>Export Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Bar options={chartOptions} data={exportAnalytics} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle>Recent MSMEs</CardTitle>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search MSMEs..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4">
              {paginatedMSMEs.map((msme) => (
                <div
                  key={msme.id}
                  className="mb-4 rounded-lg border border-emerald-600 bg-white p-4 shadow-md last:mb-0"
                >
                  <h3 className="text-lg font-semibold">{msme.name}</h3>
                  <p className="text-sm">
                    <strong>Email:</strong> {msme.email}
                  </p>
                  <p className="text-sm">
                    <strong>Address:</strong> {msme.address}
                  </p>
                  <p className="text-sm">
                    <strong>Registration Date:</strong> {msme.registrationDate}
                  </p>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredMSMEs.length,
                    )}{" "}
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
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-gray-600 hover:bg-emerald-100"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
