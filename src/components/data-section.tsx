"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataSection() {
  return (
    <section className="py-20">
      <div className="container bg-[#8B4513]">
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-white">Open Data</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-12 md:grid-cols-2 lg:grid-cols-2">
        <Card className="cursor-pointer border-[#DEB887] transition-shadow hover:shadow-lg">
          <CardHeader className="p-0">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Total Registered MSMEs
            </h3>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="mt-2 text-xl font-semibold text-[#8B4513]">
              652
            </CardTitle>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-[#DEB887] transition-shadow hover:shadow-lg">
          <CardHeader className="p-0">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Total Sectors
            </h3>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="mt-2 text-xl font-semibold text-[#8B4513]">
              7
            </CardTitle>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
