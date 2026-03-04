import styles from "./report.module.css";

interface PartPageProps {
  partNumber: string;
  title: string;
  description?: string;
  sections?: { number: string; title: string }[];
}

export const PartPage = ({
  partNumber,
  title,
  description,
  sections,
}: PartPageProps) => {
  return (
    <div className={styles.partPage}>
      <span className={styles.partNumber}>{partNumber}</span>
      <h2 className={styles.partTitle}>{title}</h2>
      {description && <p className={styles.partDescription}>{description}</p>}
      {sections && sections.length > 0 && (
        <div className={styles.partSections}>
          {sections.map((sec) => (
            <div key={sec.number} className={styles.partSectionItem}>
              <span className={styles.partSectionNumber}>{sec.number}</span>
              <span className={styles.partSectionTitle}>{sec.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
