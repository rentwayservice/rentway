import type { ImageUploaderProps } from "./image-uploader.types";

export const ImageUploader = ({
  className,
  label = "Upload images",
}: ImageUploaderProps) => {
  return (
    <div className={`rounded-2xl border bg-white p-6 ${className ?? ""}`}>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground">
        Drag and drop files here or connect storage.
      </div>
    </div>
  );
};
