"use client";

import { Star } from "lucide-react";

import { REVIEWS } from "@/libs/constants/reviews";

import styles from "./ReviewSlider.module.css";

const StarRating = ({ rating }: { rating: number }) => (
  <div className={styles.stars} aria-label={`${rating}점`} role="img">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "currentColor" : "none"}
        strokeWidth={1.5}
        className={i < rating ? styles.starFilled : styles.starEmpty}
      />
    ))}
  </div>
);

const formatDate = (dateStr: string): string => {
  const [year, month] = dateStr.split("-");
  return `${year}.${month}`;
};

const trimmedReviews = REVIEWS.map((review) => ({
  ...review,
  text: review.text.trim(),
}));

export const ReviewSlider = () => {
  const doubled = [...trimmedReviews, ...trimmedReviews];

  return (
    <section id="reviews" className={styles.section} aria-label="이용자 후기">
      <div className={styles.header}>
        <p className={styles.sectionLabel}>Reviews</p>
        <h2 className={styles.sectionTitle}>이용자 후기</h2>
        <p className={styles.sectionSubtitle}>
          실제 컨설팅을 받으신 분들의 솔직한 후기입니다
        </p>
      </div>

      <div className={styles.track} role="list" aria-label="후기 목록">
        {doubled.map((review, index) => (
          <div
            key={`${review.name}-${review.date}-${index}`}
            className={styles.card}
            role="listitem"
          >
            <StarRating rating={review.rating} />
            <p className={styles.reviewText}>&ldquo;{review.text}&rdquo;</p>
            <div className={styles.cardFooter}>
              <span className={styles.name}>{review.name}</span>
              <span className={styles.date}>{formatDate(review.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
