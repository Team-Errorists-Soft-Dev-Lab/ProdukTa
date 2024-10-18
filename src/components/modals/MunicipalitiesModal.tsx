import { municipalities } from "../../../mock_data/dummyData";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

export default function MunicipalitiesModal() {

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center text-base">
          <ArrowLeft className="mr-2" />
          Back
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">Search by Municipalities</h2>
        <div className="grid grid-cols-2 gap-2">
          {municipalities.map((municipality, index) => (
            <Button key={index} variant="outline" className="justify-start">
              {municipality}
            </Button>
          ))}
        </div>
      </div>
    </DialogContent>
  );
}