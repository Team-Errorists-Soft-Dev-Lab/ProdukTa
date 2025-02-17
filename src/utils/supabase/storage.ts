import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = "msme-images";

export async function uploadMultipleImages(files: File[]) {
  const uploadPromises = files.map(async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  });

  return Promise.all(uploadPromises);
}

export async function deleteMultipleImages(paths: string[]) {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths);

  if (error) throw error;
}

export function getImageUrl(path: string) {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return data.publicUrl;
}
