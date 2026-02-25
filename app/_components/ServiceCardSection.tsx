import Image from "next/image";

import { FadeIn } from "./FadeIn";
import styles from "./ServiceCardSection.module.css";

interface ServiceCardData {
  title: string;
  description: string;
  image: string;
}

const SERVICES: ServiceCardData[] = [
  {
    title: "생활기록부 정밀 진단",
    description: "데이터로 증명하는 내 생기부의 객관적 경쟁력과 강약점 진단",
    image: "/images/landing/service-1.png",
  },
  {
    title: "전공 적합성 분석",
    description:
      "목표 대학 인재상과 내 활동의 일치도를 분석하여 합격 가능성 검증",
    image: "/images/landing/service-2.png",
  },
  {
    title: "심층 컨설팅 리포트",
    description: "입시 노하우가 집약된 10~25페이지 분량의 맞춤형 합격 전략",
    image: "/images/landing/service-3.png",
  },
  {
    title: "AI 맞춤 면접 질문",
    description: "내 생기부에서 직접 추출한 예상 질문으로 실전 면접 대비",
    image: "/images/landing/service-4.png",
  },
  {
    title: "학기별 활동 설계",
    description: "남은 기간 채워야 할 가장 확실한 활동 가이드 제시",
    image: "/images/landing/service-5.png",
  },
  {
    title: "1:1 전문가 상담",
    description:
      "AI 리포트를 바탕으로 전문 컨설턴트가 제공하는 심층 분석과 최종 전략",
    image: "/images/landing/service-6.png",
  },
];

const ServiceCard = ({ item }: { item: ServiceCardData }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDesc}>{item.description}</p>
      </div>
      <div className={styles.cardImage}>
        <Image
          src={item.image}
          alt={item.title}
          width={280}
          height={200}
          className={styles.image}
        />
      </div>
    </div>
  );
};

export const ServiceCardSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <div className={styles.header}>
            <span className={styles.label}>Services</span>
            <h2 className={styles.title}>리포트 하나에 담기는 6가지 분석</h2>
            <p className={styles.subtitle}>
              모든 분석 결과는 전문가 검수를 거쳐 전달됩니다
            </p>
          </div>
        </FadeIn>
        <div className={styles.grid}>
          {SERVICES.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08}>
              <ServiceCard item={item} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
