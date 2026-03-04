import styles from "./report.module.css";

interface BarChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface ReportBarChartProps {
  title?: string;
  data: BarChartDataItem[];
  height?: number;
  yAxisLabel?: string;
  yAxisReversed?: boolean;
  yDomain?: [number, number];
  formatTooltip?: (value: number) => string;
  defaultBarColor?: string;
  showLegend?: boolean;
  legendLabel?: string;
}

export const ReportBarChart = ({
  title,
  data,
  height = 200,
  yAxisReversed = false,
  yDomain,
  formatTooltip,
  defaultBarColor = "var(--report-accent, #4F46E5)",
}: ReportBarChartProps) => {
  const max = yDomain ? yDomain[1] : Math.max(...data.map((d) => d.value));
  const min = yDomain ? yDomain[0] : 0;
  const range = max - min;

  const getBarHeight = (value: number): number => {
    if (range === 0) return 0;
    if (yAxisReversed) {
      return ((max - value) / range) * 100;
    }
    return ((value - min) / range) * 100;
  };

  return (
    <div className={styles.chartContainer}>
      {title && <div className={styles.chartTitle}>{title}</div>}
      <div className={styles.cssBarChart} style={{ height }}>
        {data.map((item) => {
          const barPct = getBarHeight(item.value);
          const label = formatTooltip
            ? formatTooltip(item.value)
            : String(item.value);

          return (
            <div key={item.name} className={styles.cssBarGroup}>
              <div className={styles.cssBarTrack}>
                <div
                  className={styles.cssBar}
                  style={{
                    height: `${barPct}%`,
                    backgroundColor: item.color ?? defaultBarColor,
                  }}
                >
                  <span className={styles.cssBarValue}>{label}</span>
                </div>
              </div>
              <div className={styles.cssBarLabel}>{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
