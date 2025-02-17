import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const generateRandomBit = () => {
  return crypto.randomBytes(16).toString("hex");
};

export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from("msme-images").remove([path]);
  if (error) throw error;
}

export async function uploadImage(
  file: File,
  fileName: string,
): Promise<string> {
  try {
    const randomBit = generateRandomBit();
    const { data, error } = await supabase.storage
      .from("msme-images")
      .upload(`${fileName}-${randomBit}`, file);

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
    throw error;
  }
}
