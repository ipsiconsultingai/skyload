import { X, Info } from "lucide-react";

import type { ImageFile } from "./types";
import { DropZone } from "./DropZone";

import styles from "../page.module.css";

interface ImageUploadStepProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
}

export const ImageUploadStep = ({
  images,
  onImagesChange,
}: ImageUploadStepProps) => {
  const handleFiles = (files: File[]) => {
    const newImages: ImageFile[] = files
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    onImagesChange([...images, ...newImages]);
  };

  const handleRemove = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className={styles.imageUploadStep}>
      <div className={styles.textInputHeader}>
        <h3 className={styles.stepSectionTitle}>이미지 업로드</h3>
        <p className={styles.stepSectionDesc}>
          생활기록부 사진을 업로드해주세요
        </p>
      </div>

      <DropZone
        accept="image/*"
        multiple
        label="이미지를 드래그하거나 클릭하여 업로드"
        hint="JPG, PNG 파일 지원 (수량 제한 없음)"
        onFiles={handleFiles}
      />

      {images.length > 0 && (
        <div className={styles.imageGrid}>
          {images.map((img) => (
            <div key={img.id} className={styles.imageThumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={img.file.name}
                className={styles.imageThumbImg}
              />
              <button
                type="button"
                className={styles.imageThumbRemove}
                onClick={() => handleRemove(img.id)}
                aria-label={`${img.file.name} 삭제`}
              >
                <X size={14} />
              </button>
              <span className={styles.imageThumbName}>{img.file.name}</span>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className={styles.infoBox}>
          <Info size={16} />
          <span>
            업로드된 이미지는 등록 후 AI가 분석하여 성적 데이터를 추출합니다.
            분석이 완료되면 재검토를 요청드립니다.
          </span>
        </div>
      )}
    </div>
  );
};
