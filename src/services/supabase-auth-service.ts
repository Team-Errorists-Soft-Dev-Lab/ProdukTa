import { createClient } from "@/utils/supabase/server";

export async function signInWithSupabase(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function updateSupabaseUser({
  isSuperadmin,
  name,
  sectorId,
}: {
  isSuperadmin: boolean;
  name: string;
  sectorId: number;
}) {
  const supabase = await createClient();
  const metadata = {
    isSuperadmin,
    name,
    ...(sectorId !== 0 && { sectorId }),
  };

  return supabase.auth.updateUser({
    data: metadata,
  });
}

export async function signUpWithSupabase({
  email,
  password,
  name,
  sectorId,
}: {
  email: string;
  password: string;
  name: string;
  sectorId: number;
}) {
  const supabase = await createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        sectorId,
      },
    },
  });
}

export async function signOutFromSupabase() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}
