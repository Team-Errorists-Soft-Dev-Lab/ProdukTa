import React, { useState, useCallback, useRef } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "sonner";
import { Dropzone, DropzoneEmptyState } from "@/components/ui/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import type { ImageCropModalProps } from "@/types/image";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropModal({
  isOpen,
  onClose,
  onCropComplete,
  aspect = 1,
}: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const logoUpload = useSupabaseUpload({
    bucketName: "msme-images",
    path: "logos",
    maxFileSize: 5 * 1000 * 1000, // 5MB
    maxFiles: 1,
    allowedMimeTypes: ["image/*"],
    upsert: true,
  });

  const handleDropzoneFile = (file: File) => {
    setCrop(undefined); // Reset crop between images
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageSrc(result);
      }
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const getCroppedImg = useCallback(async (): Promise<File> => {
    if (!imgRef.current || !completedCrop) {
      throw new Error("No image or crop data available");
    }

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement("canvas");
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );

    return new Promise((resolve, reject) => {
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
    });
  }, [completedCrop]);

  const handleCropComplete = async () => {
    if (!completedCrop || !imageSrc) return;

    setIsLoading(true);
    try {
      const croppedFile = await getCroppedImg();
      onCropComplete(croppedFile);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose();
  };

  // When dropzone files change
  React.useEffect(() => {
    if (logoUpload.files.length > 0 && logoUpload.files[0]) {
      handleDropzoneFile(logoUpload.files[0]);
    }
  }, [logoUpload.files]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!imageSrc && (
            <div className="space-y-2">
              <Label>Upload Logo</Label>
              <Dropzone {...logoUpload}>
                <DropzoneEmptyState />
              </Dropzone>
            </div>
          )}

          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={100}
              minHeight={100}
              className="max-h-[400px] w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                className="max-h-[400px] w-full object-contain"
                onLoad={onImageLoad}
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
            disabled={!imageSrc || !completedCrop || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? "Cropping..." : "Crop Image"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
