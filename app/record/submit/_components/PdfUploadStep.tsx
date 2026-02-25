import { FileText } from "lucide-react";

import { DropZone } from "./DropZone";

import styles from "../page.module.css";

interface PdfUploadStepProps {
  pdfFile: File | null;
  pdfFileName: string;
  onPdfChange: (file: File | null, fileName: string) => void;
}

export const PdfUploadStep = ({
  pdfFile,
  pdfFileName,
  onPdfChange,
}: PdfUploadStepProps) => {
  const handleFiles = (files: File[]) => {
    const [file] = files;
    if (file && file.type === "application/pdf") {
      onPdfChange(file, file.name);
    }
  };

  return (
    <div className={styles.pdfUploadStep}>
      <div className={styles.textInputHeader}>
        <h3 className={styles.stepSectionTitle}>PDF 업로드</h3>
        <p className={styles.stepSectionDesc}>
          생활기록부 PDF 파일을 업로드해주세요
        </p>
      </div>

      {!pdfFile && (
        <DropZone
          accept=".pdf,application/pdf"
          label="PDF 파일을 드래그하거나 클릭하여 업로드"
          hint="PDF 파일만 지원됩니다"
          onFiles={handleFiles}
        />
      )}

      {pdfFile && (
        <div className={styles.pdfResult}>
          <div className={styles.pdfFileInfo}>
            <FileText size={18} />
            <span className={styles.pdfFileName}>{pdfFileName}</span>
            <button
              type="button"
              className={styles.pdfReupload}
              onClick={() => onPdfChange(null, "")}
            >
              다시 업로드
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
