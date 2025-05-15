import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="bottom-right" closeButton />
      </body>
    </html>
  );
}
