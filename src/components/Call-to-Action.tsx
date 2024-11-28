import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="bg-muted/50 py-20">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to Explore Iloilo's MSMEs?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Discover the businesses driving our economy and connect with local
          entrepreneurs today!
        </p>
        <Button size="lg">
          Search Directory Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
