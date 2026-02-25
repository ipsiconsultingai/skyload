import { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";

import styles from "../page.module.css";

interface DropZoneProps {
  accept: string;
  multiple?: boolean;
  label: string;
  hint: string;
  onFiles: (files: File[]) => void;
}

export const DropZone = ({
  accept,
  multiple = false,
  label,
  hint,
  onFiles,
}: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFiles(multiple ? files : [files[0]]);
      }
    },
    [multiple, onFiles]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      onFiles(files);
    }
    e.target.value = "";
  };

  return (
    <button
      type="button"
      className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
      />
      <div className={styles.dropZoneIcon}>
        <Upload size={24} />
      </div>
      <span className={styles.dropZoneLabel}>{label}</span>
      <span className={styles.dropZoneHint}>{hint}</span>
    </button>
  );
};
