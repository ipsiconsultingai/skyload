import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./Pagination.module.css";

interface PaginationProps {
  page?: number;
  currentPage?: number;
  totalPages: number;
  total?: number;
  totalCount?: number;
  limit?: number;
  onPageChange: (page: number) => void;
}

const MAX_VISIBLE_PAGES = 5;

const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = MAX_VISIBLE_PAGES;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - MAX_VISIBLE_PAGES + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const Pagination = ({
  page: pageProp,
  currentPage: currentPageProp,
  totalPages,
  total: totalProp,
  totalCount: totalCountProp,
  limit = 20,
  onPageChange,
}: PaginationProps) => {
  const page = pageProp ?? currentPageProp ?? 1;
  const total = totalProp ?? totalCountProp ?? 0;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  const visiblePages = getVisiblePages(page, totalPages);

  if (totalPages <= 1) {
    return (
      <div className={styles.pagination}>
        <span className={styles.info}>
          {total > 0
            ? `${startItem}-${endItem} / 총 ${total}건`
            : "데이터 없음"}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        {`${startItem}-${endItem} / 총 ${total}건`}
      </span>
      <div className={styles.controls}>
        <button
          className={styles.navButton}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="이전 페이지"
        >
          <ChevronLeft size={16} />
        </button>
        {visiblePages.map((p) => (
          <button
            key={p}
            className={`${styles.pageButton} ${
              p === page ? styles.pageButtonActive : ""
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          className={styles.navButton}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="다음 페이지"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
