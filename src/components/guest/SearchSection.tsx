import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void; // Trigger search when Enter is pressed
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  handleSearch,
}: SearchSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Enter key pressed");
      handleSearch(); // Trigger the search function
    }
  };

  return (
    <div className="relative w-full flex-1 sm:w-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        type="text"
        placeholder="Search MSMEs... (Press Enter to search)"
        className="w-full bg-white pl-10 text-[#8B4513]"
      />
    </div>
  );
}
