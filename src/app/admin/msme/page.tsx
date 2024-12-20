"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import {
//   bambooMSMEs,
//   coconutMSMEs,
//   coffeeMSMEs,
//   weavingMSMEs,
//   foodMSMEs,
// } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import type { MSME } from "@/types/superadmin";
import { useMSMEContext } from "@/contexts/MSMEContext";

const ITEMS_PER_PAGE = 9;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contactNumber: z.number().min(1000000000, {
    message: "Please enter a valid contact number.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  contactPerson: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export default function ManageMSMEs() {
  // const [msmes, setMsmes] = useState<MSME[]>([
  //   ...bambooMSMEs,
  //   ...coconutMSMEs,
  //   ...coffeeMSMEs,
  //   ...weavingMSMEs,
  //   ...foodMSMEs,
  // ]);

  // Temporary fix: useMSMEContext() should be replaced with useAdmin()
  // const { msmes } = useAdmin();
  const { msmes } = useMSMEContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMSME, setEditingMSME] = useState<MSME | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMSME, setSelectedMSME] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: 0,
      address: "",
      contactPerson: "",
      description: "",
      image: "",
    },
  });

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

  const handleAddMSME = (values: z.infer<typeof formSchema>) => {
    const id =
      msmes.length > 0 ? Math.max(...msmes.map((msme) => msme.id)) + 1 : 1;
    setMsmes([...msmes, { id, ...values }]);
    setShowAddForm(false);
    form.reset();
  };

  const handleEditMSME = (values: z.infer<typeof formSchema>) => {
    if (editingMSME) {
      setMsmes(
        msmes.map((msme) => {
          if (msme.id === editingMSME.id) {
            return { ...msme, ...values };
          }
          return msme;
        }),
      );
      setShowEditForm(false);
      setEditingMSME(null);
    }
  };

  const handleDeleteMSME = (id: number) => {
    setSelectedMSME(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedMSME !== null) {
      setMsmes(msmes.filter((msme) => msme.id !== selectedMSME));
      toast.success("MSME successfully deleted!");
    }
    setShowDeleteDialog(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
      <main className="flex-1 overflow-hidden bg-gray-100">
        <div className="p-4 md:p-6">
          <Card className="border-[#996439]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                Registered MSMEs
              </CardTitle>
              <Button
                className="bg-[#996439]"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add MSME
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center space-x-2">
                <Search className="text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search MSMEs"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedMSMEs.map((msme) => (
                  <Card key={msme.id} className="border-[#996439]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {msme.companyName}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setEditingMSME(msme);
                            setShowEditForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteMSME(msme.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        <strong>Email:</strong> {msme.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Address:</strong> {msme.cityMunicipalityAddress}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Phone:</strong> {msme.contactNumber}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredMSMEs.length,
                    )}{" "}
                    of {filteredMSMEs.length} entries
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
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
                              : "border-[#996439] text-[#996439] hover:bg-[#bb987a] hover:text-white"
                          }
                        >
                          {page}
                        </Button>
                      ),
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
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

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New MSME</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddMSME)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add MSME</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit MSME</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEditMSME)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingMSME?.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingMSME?.email} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        defaultValue={editingMSME?.contactNumber}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingMSME?.address} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete MSME</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this MSME? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
