import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function deleteImage(path: string): Promise<void> {
  try {
    const exists = await checkImageExists(path);
    if (!exists) return;

    const { error } = await supabase.storage.from("msme-images").remove([path]);
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

export async function uploadImage(
  file: File,
  fileName: string,
): Promise<string> {
  try {
    // Generate a unique file name with timestamp
    const timestamp = Date.now();
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const uniqueFileName = `${fileName}-${timestamp}.${extension}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("msme-images")
      .upload(uniqueFileName, file);

    if (error || !data) {
      throw new Error(error?.message || "Image upload failed");
    }

    const { data: urlData } = supabase.storage
      .from("msme-images")
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get image URL");
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Failed to upload image");
  }
}

// Add a function to check if an image exists
export const checkImageExists = async (path: string): Promise<boolean> => {
  try {
    const { data } = await supabase.storage.from("msme-images").download(path);
    return !!data;
  } catch {
    return false;
  }
};
