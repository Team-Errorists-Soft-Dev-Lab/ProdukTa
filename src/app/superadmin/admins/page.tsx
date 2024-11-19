"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Edit, Trash, Check, X } from "lucide-react";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ManageAdmins() {
  const { admins, adminSignups, handleAcceptAdmin, handleRejectAdmin } =
    useSuperAdminContext();

  const pendingSignups = adminSignups.filter((s) => s.status === "pending");

  return (
    <div className="p-4 md:p-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800">
          Manage Admins
        </CardTitle>
        <CardDescription className="text-gray-600">
          Total: {admins.length} Admins | Pending: {pendingSignups.length}{" "}
          Applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="admins" className="w-full">
          <TabsList className="mb-4 outline-black">
            <TabsTrigger
              value="admins"
              className="rounded border-green-500 bg-white p-4 text-lg text-black transition-colors duration-200 hover:bg-green-600 hover:text-white"
            >
              Active Admins
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded border-green-500 bg-white p-4 text-lg text-black transition-colors duration-200 hover:bg-green-600 hover:text-white"
            >
              Pending Applications ({pendingSignups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admins">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {admins.map((admin) => (
                <Card
                  key={admin.id}
                  className="transform rounded-lg border border-emerald-600 bg-white shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {admin.name}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      {admin.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Sector:{" "}
                      <span className="font-medium">{admin.sector}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span className="font-medium text-green-600">Active</span>
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4 text-gray-600" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingSignups.map((signup) => (
                <Card
                  key={signup.id}
                  className="transform rounded-lg border border-yellow-400 bg-white shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {signup.name}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      {signup.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Sector:{" "}
                      <span className="font-medium">{signup.sector}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Applied: {signup.dateApplied}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span className="font-medium text-yellow-600">
                        Pending
                      </span>
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleAcceptAdmin(signup.id)}
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-600 transition-colors duration-200 hover:bg-green-200 hover:text-black"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRejectAdmin(signup.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-600 transition-colors duration-200 hover:bg-red-200 hover:text-black"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
}
