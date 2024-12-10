import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CallToAction() {
  const router = useRouter();

  return (
    <section className="bg-muted/50 py-20">
      <div className="container max-w-full text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to Explore Iloilo&apos;s MSMEs?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Discover the businesses driving our economy and connect with local
          entrepreneurs today!
        </p>
        <Button size="lg" onClick={() => router.push("/guest")}>
          Search Directory Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
