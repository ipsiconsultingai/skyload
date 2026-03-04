import type { ReactNode } from "react";

import styles from "./report.module.css";

interface ReportTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render: (row: T) => ReactNode;
}

interface ReportTableProps<T> {
  columns: ReportTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
}

export const ReportTable = <T,>({
  columns,
  data,
  keyExtractor,
}: ReportTableProps<T>) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={
                col.align === "center"
                  ? styles.tableAlignCenter
                  : col.align === "right"
                    ? styles.tableAlignRight
                    : undefined
              }
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={keyExtractor(row)}>
            {columns.map((col) => (
              <td
                key={col.key}
                className={
                  col.align === "center"
                    ? styles.tableAlignCenter
                    : col.align === "right"
                      ? styles.tableAlignRight
                      : undefined
                }
              >
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
