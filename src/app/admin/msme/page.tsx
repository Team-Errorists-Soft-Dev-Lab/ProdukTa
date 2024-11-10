"use client";
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Navbar from "@/components/AdminNavbar";
import Sidebar from "@/components/AdminSidebar";

interface MSME {
  id: number;
  name: string;
  description: string;
  contactPerson: string;
  address: string;
  contactNumber: string;
}

const ITEMS_PER_PAGE = 9;

export default function ManageMSMEs() {
  const [msmes, setMsmes] = useState<MSME[]>([
    {
      id: 1,
      name: "Product name",
      description: "Lorem ipsum dolor sit amet",
      contactPerson: "John Doe",
      address: "123 Main St",
      contactNumber: "123-456-7890",
    },
    {
      id: 2,
      name: "Product name",
      description: "Nisi reprehenderit",
      contactPerson: "Jane Smith",
      address: "456 Elm St",
      contactNumber: "098-765-4321",
    },
    {
      id: 3,
      name: "Product name",
      description: "Laborum mollit ex",
      contactPerson: "Bob Johnson",
      address: "789 Oak St",
      contactNumber: "111-222-3333",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMSME, setEditingMSME] = useState<MSME | null>(null);
  const [newMSME, setNewMSME] = useState<Omit<MSME, "id">>({
    name: "",
    description: "",
    contactPerson: "",
    address: "",
    contactNumber: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMSMEs = useMemo(() => {
    return msmes.filter((msme) =>
      Object.values(msme).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [msmes, searchTerm]);

  const totalPages = Math.ceil(filteredMSMEs.length / ITEMS_PER_PAGE);
  const paginatedMSMEs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMSMEs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMSMEs, currentPage]);

  const handleAddMSME = (e: React.FormEvent) => {
    e.preventDefault();
    const id =
      msmes.length > 0 ? Math.max(...msmes.map((msme) => msme.id)) + 1 : 1;
    setMsmes([...msmes, { id, ...newMSME }]);
    setShowAddForm(false);
    setNewMSME({
      name: "",
      description: "",
      contactPerson: "",
      address: "",
      contactNumber: "",
    });
  };

  const handleEditMSME = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMSME) {
      setMsmes(
        msmes.map((msme) => (msme.id === editingMSME.id ? editingMSME : msme)),
      );
      setShowEditForm(false);
      setEditingMSME(null);
    }
  };

  const handleDeleteMSME = (id: number) => {
    setMsmes((prevMsmes) => prevMsmes.filter((msme) => msme.id !== id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isEditing = false,
  ) => {
    const { name, value } = e.target;
    if (isEditing && editingMSME) {
      setEditingMSME({ ...editingMSME, [name]: value });
    } else {
      setNewMSME({ ...newMSME, [name]: value });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
        <Navbar />
        <div className="p-6">
          <div className="rounded-lg border border-[#996439] bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="rounded-lg border-2 border-[#996439] p-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Registered MSMEs
                  </h2>
                  <p className="mt-1 text-lg font-bold text-gray-600">
                    Total: {msmes.length} MSMEs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center rounded-md bg-[#996439] px-4 py-2 text-[#FCFBFA] transition duration-150 ease-in-out hover:bg-[#bb987a]"
              >
                <Plus size={18} className="mr-2" />
                Add MSME
              </button>
            </div>
            <div className="mb-6">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search"
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedMSMEs.map((msme) => (
                <div
                  key={msme.id}
                  className="rounded-lg border border-[#996439] bg-white p-4 shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{msme.name}</h3>
                    <div>
                      <button
                        className="mr-2 text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setEditingMSME(msme);
                          setShowEditForm(true);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteMSME(msme.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="mb-2 text-sm text-gray-500">
                    {msme.description}
                  </p>
                  <p className="text-sm">
                    <strong>Contact:</strong> {msme.contactPerson}
                  </p>
                  <p className="text-sm">
                    <strong>Address:</strong> {msme.address}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {msme.contactNumber}
                  </p>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
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
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Add New MSME</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddMSME}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newMSME.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newMSME.description}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contactPerson"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={newMSME.contactPerson}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newMSME.address}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contactNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={newMSME.contactNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-[#996439] px-4 py-2 text-white hover:bg-[#bb987a]"
                >
                  Add MSME
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditForm && editingMSME && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Edit MSME</h3>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingMSME(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditMSME}>
              <div className="mb-4">
                <label
                  htmlFor="edit-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editingMSME.name}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="edit-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editingMSME.description}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="edit-contactPerson"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contact Person
                </label>
                <input
                  type="text"
                  id="edit-contactPerson"
                  name="contactPerson"
                  value={editingMSME.contactPerson}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="edit-address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="edit-address"
                  name="address"
                  value={editingMSME.address}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="edit-contactNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="edit-contactNumber"
                  name="contactNumber"
                  value={editingMSME.contactNumber}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#996439]"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-[#996439] px-4 py-2 text-white hover:bg-[#bb987a]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
