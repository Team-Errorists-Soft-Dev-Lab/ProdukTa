import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/utils/prisma/client";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Get authenticated user instead of session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Auth error:", userError);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Define paths
  const publicPaths = ["/login", "/signup", "/guest", "/landing-page"];
  const adminPaths = ["/admin"];
  const superadminPaths = ["/superadmin"];
  const currentPath = request.nextUrl.pathname;

  // Check if current path is protected
  const isPublicPath = publicPaths.some((path) => currentPath.startsWith(path));
  const isAdminPath = adminPaths.some((path) => currentPath.startsWith(path));
  const isSuperadminPath = superadminPaths.some((path) =>
    currentPath.startsWith(path),
  );

  // Check if user exists and get their status from database
  if (user) {
    const dbUser = await prisma.admin.findUnique({
      where: { email: user.email },
    });

    if (dbUser?.isPending) {
      // Redirect pending admins to a waiting page
      if (!currentPath.startsWith("/pending")) {
        return NextResponse.redirect(new URL("/pending", request.url));
      }
    }

    const isSuperadmin = dbUser?.isSuperadmin ?? false;

    // Prevent authenticated users from accessing login/signup
    if (isPublicPath) {
      return NextResponse.redirect(
        new URL(isSuperadmin ? "/superadmin" : "/admin", request.url),
      );
    }

    // Check role-based access
    if (isSuperadminPath && !isSuperadmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAdminPath && isSuperadmin) {
      return NextResponse.redirect(new URL("/superadmin", request.url));
    }

    return supabaseResponse;
  }

  // No authenticated user - handle public access
  if (isPublicPath) return supabaseResponse;

  // Redirect to login for protected paths
  return NextResponse.redirect(new URL("/login", request.url));
}
