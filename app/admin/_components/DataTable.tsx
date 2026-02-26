import type { ReactNode } from "react";

import styles from "./DataTable.module.css";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  loadingContent?: ReactNode;
  emptyContent?: ReactNode;
}

export const DataTable = <T,>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  loadingContent,
  emptyContent,
}: DataTableProps<T>) => {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={styles.th}
                  style={{
                    ...(col.width ? { width: col.width } : {}),
                    ...(col.align ? { textAlign: col.align } : {}),
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className={styles.loadingRow} colSpan={columns.length}>
                  {loadingContent}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td className={styles.loadingRow} colSpan={columns.length}>
                  {emptyContent}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor ? keyExtractor(item) : index}
                  className={styles.tr}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={styles.td}
                      style={col.align ? { textAlign: col.align } : undefined}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
