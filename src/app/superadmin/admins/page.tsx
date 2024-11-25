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
import { Check, X } from "lucide-react";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ManageAdmins() {
  const { activeAdmins, pendingAdmins, handleAcceptAdmin, handleRejectAdmin } =
    useSuperAdminContext();

  return (
    <div className="p-4 md:p-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800">
          Manage Admins
        </CardTitle>
        <CardDescription className="text-gray-600">
          Active: {activeAdmins.length} Admins | Pending: {pendingAdmins.length}{" "}
          Applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4 outline-black">
            <TabsTrigger
              value="active"
              className="rounded border-green-500 bg-white p-4 text-lg text-black transition-colors duration-200 hover:bg-green-600 hover:text-white"
            >
              Active Admins ({activeAdmins.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded border-green-500 bg-white p-4 text-lg text-black transition-colors duration-200 hover:bg-green-600 hover:text-white"
            >
              Pending Applications ({pendingAdmins.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeAdmins.map((admin) => (
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
                      <span className="font-medium">
                        {admin.sectors[0]?.sector.name || "Unknown"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span className="font-medium text-green-600">Active</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingAdmins.map((admin) => (
                <Card
                  key={admin.id}
                  className="transform rounded-lg border border-yellow-400 bg-white shadow-md"
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
                      Applied: {admin.dateApplied}
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
                      onClick={() => handleAcceptAdmin(admin.id)}
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-600 transition-colors duration-200 hover:bg-green-200 hover:text-black"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRejectAdmin(admin.id)}
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
