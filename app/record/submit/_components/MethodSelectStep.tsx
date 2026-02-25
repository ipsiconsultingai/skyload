import Image from "next/image";

import type { InputMethod } from "./types";

import styles from "../page.module.css";

interface MethodSelectStepProps {
  onSelect: (method: InputMethod) => void;
}

const METHODS = [
  {
    id: "pdf" as const,
    image: "/images/reocrd/pdf-upload.png",
    title: "PDF 업로드",
    description: "생활기록부 PDF 파일에서 텍스트를 자동 추출합니다",
  },
  {
    id: "image" as const,
    image: "/images/reocrd/image-upload.png",
    title: "이미지 업로드",
    description: "생활기록부 사진을 업로드하면 AI가 분석합니다",
  },
  {
    id: "text" as const,
    image: "/images/reocrd/custom-text.png",
    title: "직접 입력",
    description: "과목별 성적 정보를 직접 입력합니다",
  },
] as const;

export const MethodSelectStep = ({ onSelect }: MethodSelectStepProps) => (
  <div className={styles.methodGrid}>
    {METHODS.map(({ id, image, title, description }) => (
      <button
        key={id}
        type="button"
        className={styles.methodCard}
        onClick={() => onSelect(id)}
      >
        <div className={styles.methodIcon}>
          <Image src={image} alt={title} width={56} height={56} />
        </div>
        <span className={styles.methodTitle}>{title}</span>
        <span className={styles.methodDesc}>{description}</span>
      </button>
    ))}
  </div>
);
