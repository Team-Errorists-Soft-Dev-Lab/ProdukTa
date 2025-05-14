import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function deleteImage(path: string): Promise<void> {
  try {
    // If path is a URL, extract the actual file path
    let filePath = path;

    // Match pattern like: https://<project-id>.supabase.co/storage/v1/object/public/msme-images/logo-12345.jpg
    if (path.includes("/storage/v1/object/public/msme-images/")) {
      const regex = /\/storage\/v1\/object\/public\/msme-images\/(.+)/;
      const match = regex.exec(path);
      filePath = match?.[1] || path;
    }

    const exists = await checkImageExists(filePath);
    if (!exists) return;

    const { error } = await supabase.storage
      .from("msme-images")
      .remove([filePath]);
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

    // Get the public URL with correct formatting
    const { data: urlData } = supabase.storage
      .from("msme-images")
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get image URL");
    }

    // Format: https://<supabase-project-id>.supabase.co/storage/v1/object/public/bucket-name/path
    // Ensure the URL is properly formatted
    let publicUrl = urlData.publicUrl;

    // If the URL doesn't already start with the expected format, reformat it
    if (!publicUrl.includes("storage/v1/object/public")) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      publicUrl = `${supabaseUrl}/storage/v1/object/public/msme-images/${data.path}`;
    }

    return publicUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Failed to upload image");
  }
}

// Add a function to check if an image exists
export const checkImageExists = async (path: string): Promise<boolean> => {
  try {
    // If path is a URL, extract the actual file path
    let filePath = path;

    // Match pattern like: https://<project-id>.supabase.co/storage/v1/object/public/msme-images/logo-12345.jpg
    if (path.includes("/storage/v1/object/public/msme-images/")) {
      const regex = /\/storage\/v1\/object\/public\/msme-images\/(.+)/;
      const match = regex.exec(path);
      filePath = match?.[1] || path;
    }

    const { data } = await supabase.storage
      .from("msme-images")
      .download(filePath);
    return !!data;
  } catch {
    return false;
  }
};
