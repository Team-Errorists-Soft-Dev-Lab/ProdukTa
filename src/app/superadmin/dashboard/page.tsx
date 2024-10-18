"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";

export default function Dashboard() {
  const { sectors, admins, msmes } = useSuperAdminContext();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Sectors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{sectors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{admins.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total MSMEs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{msmes.length}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent MSMEs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {msmes.slice(0, 5).map((msme) => (
                <TableRow key={msme.id}>
                  <TableCell>{msme.name}</TableCell>
                  <TableCell>{msme.sector}</TableCell>
                  <TableCell>{msme.email}</TableCell>
                  <TableCell>{msme.registrationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
