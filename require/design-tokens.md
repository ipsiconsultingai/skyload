# Design Tokens 가이드

> **Primary Color**: Indigo (#4F46E5)
> **Default Theme**: Light
> **CSS Framework**: Tailwind CSS v4

---

## 1. 색상 체계

### 1.1 Primary (Indigo)

| Scale | Hex | 용도 |
|-------|---------|------|
| 50 | `#EEF2FF` | 배경 하이라이트, subtle 영역 |
| 100 | `#E0E7FF` | 연한 배경, 호버 배경 |
| 200 | `#C7D2FE` | 보더, 배지 배경 |
| 300 | `#A5B4FC` | 아이콘, 진행 바 |
| 400 | `#818CF8` | 다크모드 텍스트 강조 |
| 500 | `#6366F1` | 서브 액센트, 다크모드 CTA |
| **600** | **`#4F46E5`** | **Primary — CTA 버튼, 링크** |
| 700 | `#4338CA` | 호버 상태 |
| 800 | `#3730A3` | 액티브/프레스 상태 |
| 900 | `#312E81` | 강조 텍스트 |
| 950 | `#1E1B4B` | 극강조, 다크 배경 |

### 1.2 Neutral (Slate)

텍스트, 배경, 보더 등 기본 UI 요소에 사용.

| Scale | Hex | 용도 |
|-------|---------|------|
| 50 | `#F8FAFC` | 페이지 서브 배경 |
| 100 | `#F1F5F9` | 카드 내부 배경 |
| 200 | `#E2E8F0` | 보더, 구분선 |
| 300 | `#CBD5E1` | 강한 보더 |
| 400 | `#94A3B8` | placeholder, muted 텍스트 |
| 500 | `#64748B` | 보조 텍스트 |
| 600 | `#475569` | 본문 보조 텍스트 |
| 700 | `#334155` | 본문 텍스트 (다크모드) |
| 800 | `#1E293B` | 헤더 텍스트 (다크모드) |
| 900 | `#0F172A` | 기본 텍스트 (라이트모드) |
| 950 | `#020617` | 다크모드 배경 |

### 1.3 Semantic Colors

| 역할 | Light 기본 | Dark 기본 |
|------|-----------|----------|
| Success | `#16A34A` (green-600) | `#22C55E` (green-500) |
| Warning | `#D97706` (amber-600) | `#F59E0B` (amber-500) |
| Error | `#DC2626` (red-600) | `#EF4444` (red-500) |
| Info | `#0284C7` (sky-600) | `#0EA5E9` (sky-500) |

---

## 2. Semantic Token 사용법

### 배경

| Token | Light | Dark | Tailwind Class |
|-------|-------|------|----------------|
| `--color-bg` | `#FFFFFF` | `neutral-950` | `bg-bg` |
| `--color-bg-secondary` | `neutral-50` | `neutral-900` | `bg-bg-secondary` |
| `--color-bg-tertiary` | `neutral-100` | `neutral-800` | `bg-bg-tertiary` |
| `--color-bg-elevated` | `#FFFFFF` | `neutral-900` | `bg-bg-elevated` |
| `--color-bg-primary` | `primary-600` | `primary-500` | `bg-bg-primary` |
| `--color-bg-primary-subtle` | `primary-50` | `primary/15%` | `bg-bg-primary-subtle` |

### 텍스트

| Token | Light | Dark | Tailwind Class |
|-------|-------|------|----------------|
| `--color-fg` | `neutral-900` | `neutral-50` | `text-fg` |
| `--color-fg-secondary` | `neutral-600` | `neutral-400` | `text-fg-secondary` |
| `--color-fg-tertiary` | `neutral-400` | `neutral-500` | `text-fg-tertiary` |
| `--color-fg-primary` | `primary-600` | `primary-400` | `text-fg-primary` |

### 보더

| Token | Light | Dark | Tailwind Class |
|-------|-------|------|----------------|
| `--color-border` | `neutral-200` | `neutral-800` | `border-border` |
| `--color-border-strong` | `neutral-300` | `neutral-700` | `border-border-strong` |
| `--color-border-primary` | `primary-600` | `primary-500` | `border-border-primary` |

---

## 3. 다크 모드

- **방식**: CSS class 기반 (`.dark` 클래스를 `<html>` 에 토글)
- **기본값**: Light
- Tailwind의 `dark:` prefix로 추가 스타일 가능

```tsx
// 예: 다크 모드 토글
<html className={isDark ? "dark" : ""}>
```

---

## 4. 사용 예시

```tsx
// CTA 버튼
<button className="bg-bg-primary text-fg-inverse rounded-lg px-6 py-3 hover:bg-bg-primary-hover">
  분석 시작하기
</button>

// 카드
<div className="bg-bg-elevated border border-border rounded-xl shadow-sm p-6">
  <h3 className="text-fg font-semibold">Lite Report</h3>
  <p className="text-fg-secondary mt-2">기본 진단형</p>
</div>

// 배지
<span className="bg-bg-primary-subtle text-fg-primary rounded-full px-3 py-1 text-sm">
  인기
</span>
```

---

## 5. 타이포그래피

| 토큰 | 스택 |
|------|------|
| `--font-sans` | Pretendard Variable, system-ui 폴백 |
| `--font-mono` | JetBrains Mono, Fira Code 폴백 |

---

## 6. Elevation (Shadow)

| Level | Token | 용도 |
|-------|-------|------|
| 0 | — | 플랫 (보더만) |
| 1 | `shadow-xs` | 인풋 필드 |
| 2 | `shadow-sm` | 카드 |
| 3 | `shadow-md` | 드롭다운 |
| 4 | `shadow-lg` | 모달, 팝오버 |
| 5 | `shadow-xl` | 토스트, 알림 |
