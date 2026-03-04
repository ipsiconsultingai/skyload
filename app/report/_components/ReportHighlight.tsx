import styles from "./report.module.css";

interface ReportHighlightProps {
  sentence: string;
  evaluation: string;
  isHighlight: boolean;
}

export const ReportHighlight = ({
  sentence,
  evaluation,
  isHighlight,
}: ReportHighlightProps) => {
  const boxClass = isHighlight
    ? styles.quoteBoxHighlight
    : styles.quoteBoxImprove;

  return (
    <div className={boxClass}>
      <div className={styles.quoteText}>{sentence}</div>
      <div className={styles.quoteEvaluation}>{evaluation}</div>
    </div>
  );
};
