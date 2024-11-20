"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/AdminNavbar";
import Link from "next/link";
import {
  bambooMSMEs,
  coconutMSMEs,
  coffeeMSMEs,
  weavingMSMEs,
  foodMSMEs,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allMSMEs = useMemo(
    () => [
      ...bambooMSMEs,
      ...coconutMSMEs,
      ...coffeeMSMEs,
      ...weavingMSMEs,
      ...foodMSMEs,
    ],
    [],
  );

  const filteredMSMEs = useMemo(() => {
    return allMSMEs.filter(
      (msme) =>
        msme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msme.address.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, allMSMEs]);

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
      <main className="flex-1 overflow-x-hidden bg-gray-100">
        <Navbar />
        <div className="p-4 md:p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="border-[#996439]">
              <CardHeader>
                <CardTitle>Total Registered MSMEs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{allMSMEs.length}</p>
              </CardContent>
            </Card>
            <Card className="max-w-[200px] border-[#996439]">
              <CardHeader></CardHeader>
              <CardContent>
                <Link href="/admin/export-data">
                  <Button className="w-full max-w-[200px] bg-[#996439] text-white hover:bg-[#bb987a]">
                    Export Data
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[#996439]">
            <CardHeader>
              <CardTitle>List of Enterprises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center space-x-2">
                <Search className="text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search by name or location"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1"
                />
              </div>

              {paginatedMSMEs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedMSMEs.map((msme) => (
                    <Card key={msme.id} className="border-[#996439]">
                      <CardContent className="p-4">
                        <h3 className="mb-2 text-lg font-semibold">
                          {msme.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <strong>Location:</strong> {msme.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Email:</strong> {msme.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Phone:</strong> {msme.contactNumber}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No matching MSMEs found.
                </p>
              )}

              {totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredMSMEs.length,
                    )}{" "}
                    of {filteredMSMEs.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="bg-[#996439] text-white hover:bg-[#bb987a]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className={
                            currentPage === page
                              ? "bg-[#996439] text-white"
                              : "border-[#996439] text-[#996439] hover:bg-[#996439] hover:text-white"
                          }
                        >
                          {page}
                        </Button>
                      ),
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="bg-[#996439] text-white hover:bg-[#bb987a]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
