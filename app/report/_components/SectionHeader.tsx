import styles from "./report.module.css";

interface SectionHeaderProps {
  number: number;
  title: string;
  subtitle?: string;
}

export const SectionHeader = ({
  number,
  title,
  subtitle,
}: SectionHeaderProps) => {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionNumber}>
        {String(number).padStart(2, "0")}
      </span>
      <div className={styles.sectionTitleGroup}>
        <span className={styles.sectionTitle}>{title}</span>
        {subtitle && <span className={styles.sectionSubtitle}>{subtitle}</span>}
      </div>
    </div>
  );
};
