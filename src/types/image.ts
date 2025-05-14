export interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (file: File) => void;
  aspect?: number;
}
