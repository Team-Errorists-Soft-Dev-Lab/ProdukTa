import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define paths
  const publicPaths = ["/login", "/signup", "/guest"];
  const adminPaths = ["/admin"];
  const superadminPaths = ["/superadmin"];
  const currentPath = request.nextUrl.pathname;

  // Check if current path is protected
  const isPublicPath = publicPaths.some((path) => currentPath.startsWith(path));
  const isAdminPath = adminPaths.some((path) => currentPath.startsWith(path));
  const isSuperadminPath = superadminPaths.some((path) =>
    currentPath.startsWith(path),
  );

  // No session - handle public access
  if (!session) {
    // Allow access to public paths
    if (isPublicPath) return supabaseResponse;

    // Redirect to login for protected paths
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Has session - handle role-based access
  const isSuperadmin = session.user.user_metadata?.isSuperadmin as boolean;

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
