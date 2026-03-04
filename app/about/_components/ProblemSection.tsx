import Image from "next/image";

import { FadeIn } from "../../_components/FadeIn";
import styles from "./ProblemSection.module.css";

interface ProblemItem {
  image: string;
  title: string;
  description: string;
}

const PROBLEMS: ProblemItem[] = [
  {
    image: "/images/about/problem1.png",
    title: "세특이 잘 쓰여진 건지 모르겠어요",
    description:
      "교사 추천서나 선배 피드백 없이, 혼자 판단하기 어려운 세특의 품질",
  },
  {
    image: "/images/about/problem2.png",
    title: "어떤 활동을 더 해야 할지 막막해요",
    description: "남은 학기에 어떤 활동이 가장 효과적인지 전략이 필요할 때",
  },
  {
    image: "/images/about/problem3.png",
    title: "자소서에 쓸 소재가 없는 것 같아요",
    description: "생기부 속 숨겨진 스토리를 찾아 자소서와 면접에 활용",
  },
  {
    image: "/images/about/problem4.png",
    title: "학원 컨설팅은 너무 비싸요",
    description: "수백만 원 컨설팅의 핵심만 합리적 가격으로 제공",
  },
];

export const ProblemSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <FadeIn>
          <span className={styles.label}>Pain Points</span>
          <h2 className={styles.sectionTitle}>이런 고민, 한 번쯤 해보셨죠?</h2>
        </FadeIn>

        <div className={styles.cardsGrid}>
          {PROBLEMS.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08}>
              <div className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className={styles.problemImage}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
