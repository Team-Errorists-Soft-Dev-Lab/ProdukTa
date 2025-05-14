import React, { useState, useRef, useCallback } from "react";
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
import { useDropzone } from "react-dropzone";
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

  const handleDropzoneFile = useCallback((file: File) => {
    setCrop(undefined); // Reset crop between images
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageSrc(result);
      }
    });
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && acceptedFiles[0]) {
        const file = acceptedFiles[0];
        if (file.type.startsWith("image/")) {
          handleDropzoneFile(file);
        } else {
          toast.error("Invalid file type. Please upload an image.");
        }
      }
    },
    [handleDropzoneFile],
  );

  const {
    getRootProps: getRootPropsHook,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    maxSize: 5 * 1000 * 1000, // 5MB
  });

  const allRootProps = getRootPropsHook();
  const {
    isDragActive: _isDragActiveFromProps,
    tabIndex: _tabIndexFromProps,
    ...rootProps
  } = allRootProps;

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
              <div
                {...rootProps}
                tabIndex={_tabIndexFromProps}
                className={`mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 ${
                  _isDragActiveFromProps
                    ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/10"
                    : ""
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <p className="relative rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500 dark:bg-transparent dark:text-indigo-400 dark:hover:text-indigo-300">
                      <span>Upload a file</span>
                    </p>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
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
