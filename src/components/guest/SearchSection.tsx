import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void; // For manual search on Enter
  isSearching: boolean; // Add loading state
  handleInputChange: (value: string) => void; // For debounced real-time search
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  handleInputChange,
}: SearchSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleInputChange(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    handleInputChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      className={cn(
        "relative w-full flex-1 transition-all duration-200 sm:w-auto",
        isFocused ? "rounded-md ring-2 ring-amber-500" : "",
      )}
    >
      <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400">
        {isSearching ? (
          <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </div>

      <Input
        ref={inputRef}
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type="text"
        placeholder={isSearching ? "Searching MSMEs..." : "Search MSMEs..."}
        aria-label="Search MSMEs"
        aria-busy={isSearching}
        className={cn(
          "w-full bg-white pl-10 pr-10 text-[#8B4513] transition-all",
          isSearching ? "animate-pulse" : "",
          searchQuery ? "pr-10" : "pr-4",
        )}
      />

      {searchQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClearSearch}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 transform rounded-full p-0 opacity-70 transition-opacity hover:bg-gray-200 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
