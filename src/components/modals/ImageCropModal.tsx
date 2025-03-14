import React, { useState, useCallback } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "react-image-crop/dist/ReactCrop.css";
import { validateImage, compressImage } from "@/utils/imageUtils";
import { toast } from "sonner";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (file: File) => void;
  aspect?: number;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  onCropComplete,
  aspect = 1,
}: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    const validation = validateImage(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {
      // Compress image before creating preview
      const compressedFile = await compressImage(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const result = reader.result as string;
        if (result) {
          setImageSrc(result);
        }
      });
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast.error("Failed to process image");
      console.error(error);
    }
  };

  const getCroppedImg = useCallback((): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!imageRef?.width || !crop?.width || !crop?.height) {
        reject(new Error("No image or crop data available"));
        return;
      }

      const canvas = document.createElement("canvas");
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imageRef,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "cropped-image.jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(file);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.9,
        );
      }
    });
  }, [crop, imageRef]);

  const handleCropComplete = async () => {
    if (!crop || !imageSrc) return;

    setIsLoading(true);
    try {
      const croppedFile = await getCroppedImg();
      onCropComplete(croppedFile);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogDescription />
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!imageSrc && (
            <div className="space-y-2">
              <Label htmlFor="image-upload">Select Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
          )}

          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCrop(c)}
              aspect={aspect}
              minWidth={200}
              minHeight={200}
            >
              <img
                ref={(img) => setImageRef(img)}
                src={imageSrc}
                alt="Crop preview"
                className="max-h-[400px] w-full object-contain"
              />
            </ReactCrop>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleCropComplete}
            disabled={!imageSrc || isLoading}
          >
            {isLoading ? "Cropping..." : "Crop Image"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
