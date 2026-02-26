# 어드민 UI/UX 디자인 가이드

## 1. 디자인 원칙

- **기존 서비스와 시각적으로 구분**: 어드민은 다크 사이드바 + 밝은 콘텐츠 영역 조합으로 유저 서비스와 명확히 구분한다.
- **기존 디자인 토큰 재사용**: globals.css에 정의된 CSS 변수(--color-primary-_, --color-neutral-_, --shadow-\* 등)를 최대한 활용한다.
- **CSS Modules 패턴 유지**: 각 컴포넌트마다 `.module.css` 파일을 사용한다.
- **정보 밀도 우선**: 어드민은 데이터를 한눈에 파악해야 하므로, 랜딩 페이지보다 간격이 좁고 폰트가 작다.

---

## 2. 색상 팔레트

### 2.1 어드민 전용 CSS 변수

`app/admin/admin.module.css` 또는 레이아웃 루트에 아래 변수를 선언한다.

```css
/* ============================================
   Admin Design Tokens
   ============================================ */
.adminRoot {
  /* Sidebar */
  --admin-sidebar-bg: var(--color-neutral-900); /* #0f172a */
  --admin-sidebar-bg-hover: var(--color-neutral-800); /* #1e293b */
  --admin-sidebar-fg: var(--color-neutral-400); /* #94a3b8 */
  --admin-sidebar-fg-active: #ffffff;
  --admin-sidebar-accent: var(--color-primary-400); /* #818cf8 */
  --admin-sidebar-width: 256px;
  --admin-sidebar-collapsed-width: 72px;

  /* Header */
  --admin-header-height: 56px;
  --admin-header-bg: #ffffff;
  --admin-header-border: var(--color-border); /* neutral-200 */

  /* Content */
  --admin-content-bg: var(--color-neutral-50); /* #f8fafc */
  --admin-content-padding: 24px;

  /* Cards */
  --admin-card-bg: #ffffff;
  --admin-card-border: var(--color-border);
  --admin-card-radius: 12px;
  --admin-card-padding: 20px;
  --admin-card-shadow: var(--shadow-sm);

  /* Table */
  --admin-table-header-bg: var(--color-neutral-50);
  --admin-table-row-hover: var(--color-primary-50); /* #eef2ff */
  --admin-table-border: var(--color-border);

  /* Spacing */
  --admin-gap-xs: 4px;
  --admin-gap-sm: 8px;
  --admin-gap-md: 16px;
  --admin-gap-lg: 24px;
  --admin-gap-xl: 32px;
}
```

### 2.2 상태 색상 (기존 토큰 활용)

| 상태      | 배경                  | 텍스트                | 용도                   |
| --------- | --------------------- | --------------------- | ---------------------- |
| 성공/활성 | `--color-success-50`  | `--color-success-600` | 완료, 활성 유저, 증가  |
| 경고/대기 | `--color-warning-50`  | `--color-warning-600` | 대기중, 검수 필요      |
| 에러/삭제 | `--color-error-50`    | `--color-error-600`   | 실패, 비활성, 감소     |
| 정보/기본 | `--color-primary-50`  | `--color-primary-600` | 정보, 링크, 선택됨     |
| 중립      | `--color-neutral-100` | `--color-neutral-600` | 기본 뱃지, 비활성 상태 |

---

## 3. 타이포그래피

기존 font-family (`--font-sans`, Pretendard Variable)를 그대로 사용한다.

| 용도               | font-size        | font-weight | color                      |
| ------------------ | ---------------- | ----------- | -------------------------- |
| 페이지 제목        | 1.5rem (24px)    | 700         | `--color-fg` (neutral-900) |
| 섹션 제목          | 1.125rem (18px)  | 600         | `--color-fg`               |
| 카드 제목          | 0.875rem (14px)  | 500         | `--color-fg-secondary`     |
| 카드 수치          | 1.75rem (28px)   | 700         | `--color-fg`               |
| 테이블 헤더        | 0.75rem (12px)   | 600         | `--color-fg-secondary`     |
| 테이블 본문        | 0.875rem (14px)  | 400         | `--color-fg`               |
| 본문/설명          | 0.875rem (14px)  | 400         | `--color-fg-secondary`     |
| 뱃지               | 0.75rem (12px)   | 600         | (상태 색상에 따름)         |
| 사이드바 메뉴      | 0.875rem (14px)  | 500         | `--admin-sidebar-fg`       |
| 사이드바 섹션 라벨 | 0.6875rem (11px) | 600         | `--color-neutral-500`      |

---

## 4. 전체 레이아웃

```
+-----------------------------------------------------------+
| [Sidebar]  |  [Header]                                    |
|  256px     |  height: 56px                                |
|            +-----------------------------------------------+
|            |                                               |
|            |  [Content Area]                               |
|            |  padding: 24px                                |
|            |  background: neutral-50                       |
|            |                                               |
|            |                                               |
|            |                                               |
+-----------------------------------------------------------+
```

### 4.1 레이아웃 CSS 구조

```css
/* AdminLayout.module.css */
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--admin-sidebar-width);
  background: var(--admin-sidebar-bg);
  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: transform 0.2s ease;
}

.main {
  margin-left: var(--admin-sidebar-width);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  height: var(--admin-header-height);
  background: var(--admin-header-bg);
  border-bottom: 1px solid var(--admin-header-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 40;
}

.content {
  flex: 1;
  padding: var(--admin-content-padding);
  background: var(--admin-content-bg);
}
```

### 4.2 반응형 브레이크포인트

| 브레이크포인트 | 사이드바 동작                              | 콘텐츠 영역        |
| -------------- | ------------------------------------------ | ------------------ |
| >= 1024px      | 고정 표시 (256px)                          | margin-left: 256px |
| 768px ~ 1023px | 축소 모드 (아이콘만, 72px)                 | margin-left: 72px  |
| < 768px        | 숨김 (햄버거 버튼으로 오버레이 슬라이드인) | margin-left: 0     |

```css
/* 반응형 사이드바 */
@media (max-width: 1023px) {
  .sidebar {
    width: var(--admin-sidebar-collapsed-width);
  }
  .main {
    margin-left: var(--admin-sidebar-collapsed-width);
  }
  .sidebarLabel {
    display: none;
  }
}

@media (max-width: 767px) {
  .sidebar {
    transform: translateX(-100%);
    width: var(--admin-sidebar-width);
  }
  .sidebarOpen {
    transform: translateX(0);
  }
  .overlay {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 0.5);
    z-index: 49;
  }
  .main {
    margin-left: 0;
  }
}
```

---

## 5. 사이드바

### 5.1 구조

```
+-------------------------------+
|  [Logo]  SKYROAD Admin        |  <- 로고 영역 (height: 56px)
|-------------------------------|
|  MENU                         |  <- 섹션 라벨 (11px, 대문자, neutral-500)
|                               |
|  [icon]  대시보드             |  <- 메뉴 아이템
|  [icon]  유저 관리            |
|  [icon]  생기부 관리          |
|  [icon]  리포트 관리          |
|                               |
|-------------------------------|
|  (spacer)                     |
|-------------------------------|
|  [icon]  설정                 |  <- 하단 고정 메뉴
+-------------------------------+
```

### 5.2 메뉴 아이템 스타일

```css
.menuItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin: 0 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--admin-sidebar-fg);
  transition: all 0.15s;
  cursor: pointer;
}

.menuItem:hover {
  background: var(--admin-sidebar-bg-hover);
  color: var(--admin-sidebar-fg-active);
}

.menuItemActive {
  background: rgb(79 70 229 / 0.15);
  color: var(--admin-sidebar-accent);
}
```

### 5.3 아이콘

lucide-react 아이콘을 사용한다. 사이드바 아이콘 size는 **20px**, strokeWidth는 **1.75**.

| 메뉴        | 아이콘            |
| ----------- | ----------------- |
| 대시보드    | `LayoutDashboard` |
| 유저 관리   | `Users`           |
| 생기부 관리 | `FileText`        |
| 리포트 관리 | `ClipboardCheck`  |
| 설정        | `Settings`        |

---

## 6. 상단 헤더

### 6.1 구조

```
+-------------------------------------------------------------------+
|  [햄버거(모바일)]  페이지 제목        [유저모드 스위치]  [프로필]  |
+-------------------------------------------------------------------+
```

### 6.2 컴포넌트 상세

#### 페이지 제목

- 현재 사이드바 활성 메뉴의 라벨을 표시
- font-size: 1.125rem, font-weight: 600

#### "유저 모드로 돌아가기" 스위치

```css
.modeSwitch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-fg-secondary);
  background: var(--color-bg);
  transition: all 0.15s;
  cursor: pointer;
}

.modeSwitch:hover {
  border-color: var(--color-primary-300);
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}
```

- 아이콘: `ArrowLeftRight` (lucide-react, size 14)
- 클릭 시 `"/"` (메인 페이지)로 이동

#### 프로필 영역

- 관리자 이름 또는 이메일 표시
- 아이콘: `CircleUser` (size 20)
- 클릭 시 로그아웃 드롭다운

---

## 7. 대시보드 페이지

### 7.1 전체 구조

```
[페이지 제목: 대시보드]
[날짜 선택기 (선택)]

[통계 카드 4개 - 한 행에 균등 배치]
+----------+ +----------+ +----------+ +----------+
| 총 유저  | | 오늘 매출 | | 생기부   | | 리포트   |
| 1,234    | | 150,000원| | 345건    | | 89건     |
| +12.5%   | | -3.2%    | | +5건     | | 검수 2건 |
+----------+ +----------+ +----------+ +----------+

[차트 영역 - 2컬럼]
+---------------------------+ +---------------------------+
| 일별 매출 추이            | | 플랜별 매출 비교          |
| (Line/Area Chart)         | | (Bar Chart)               |
|                           | |                           |
+---------------------------+ +---------------------------+

[최근 활동 또는 추가 차트]
```

### 7.2 통계 카드

```css
.statCard {
  background: var(--admin-card-bg);
  border: 1px solid var(--admin-card-border);
  border-radius: var(--admin-card-radius);
  padding: var(--admin-card-padding);
  box-shadow: var(--admin-card-shadow);
}

.statLabel {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-fg-secondary);
}

.statValue {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-fg);
  margin-top: 4px;
}

.statChange {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.statChangeUp {
  color: var(--color-success-600);
}

.statChangeDown {
  color: var(--color-error-600);
}
```

- 변화율 아이콘: `TrendingUp` / `TrendingDown` (lucide-react, size 14)
- 카드 그리드: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`, gap: 16px

### 7.3 차트 카드

```css
.chartCard {
  background: var(--admin-card-bg);
  border: 1px solid var(--admin-card-border);
  border-radius: var(--admin-card-radius);
  padding: var(--admin-card-padding);
  box-shadow: var(--admin-card-shadow);
}

.chartTitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-fg);
  margin-bottom: 16px;
}
```

- Recharts 사용
- 차트 색상: `--color-primary-500` (메인), `--color-primary-300` (서브), `--color-neutral-200` (그리드)
- 차트 높이: 300px
- 차트 그리드: 데스크톱 2컬럼 (`grid-template-columns: 1fr 1fr`), 모바일 1컬럼

---

## 8. 데이터 테이블 (유저 / 생기부 / 리포트 공통)

### 8.1 상단 영역

```
+--------------------------------------------------------------------+
| [검색 input]                        [필터 드롭다운] [상태 필터 탭] |
+--------------------------------------------------------------------+
```

#### 검색 입력

```css
.searchInput {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--admin-card-bg);
  font-size: 0.875rem;
  color: var(--color-fg);
  width: 280px;
  transition: border-color 0.15s;
}

.searchInput:focus-within {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgb(79 70 229 / 0.1);
}
```

- 아이콘: `Search` (lucide-react, size 16, color neutral-400)

#### 필터 탭 (상태별)

```css
.filterTab {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-fg-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.filterTab:hover {
  background: var(--color-neutral-100);
}

.filterTabActive {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  font-weight: 600;
}
```

### 8.2 테이블 본체

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.tableWrapper {
  background: var(--admin-card-bg);
  border: 1px solid var(--admin-card-border);
  border-radius: var(--admin-card-radius);
  overflow: hidden;
  box-shadow: var(--admin-card-shadow);
}

.th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-secondary);
  background: var(--admin-table-header-bg);
  border-bottom: 1px solid var(--admin-table-border);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.td {
  padding: 12px 16px;
  font-size: 0.875rem;
  color: var(--color-fg);
  border-bottom: 1px solid var(--admin-table-border);
  vertical-align: middle;
}

.tr:hover {
  background: var(--admin-table-row-hover);
}

.tr:last-child .td {
  border-bottom: none;
}
```

### 8.3 상태 뱃지

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

/* 상태별 변형 */
.badgeSuccess {
  background: var(--color-success-50);
  color: var(--color-success-600);
}

.badgeWarning {
  background: var(--color-warning-50);
  color: var(--color-warning-600);
}

.badgeError {
  background: var(--color-error-50);
  color: var(--color-error-600);
}

.badgeInfo {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

.badgeNeutral {
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
}
```

뱃지 매핑 예시:

| 도메인 | 상태      | 뱃지 스타일 |
| ------ | --------- | ----------- |
| 유저   | 활성      | Success     |
| 유저   | 비활성    | Neutral     |
| 생기부 | 분석 완료 | Success     |
| 생기부 | 분석 중   | Info        |
| 생기부 | 에러      | Error       |
| 리포트 | 발송 완료 | Success     |
| 리포트 | 검수 대기 | Warning     |
| 리포트 | 작성 중   | Info        |

### 8.4 페이지네이션

```css
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--admin-table-border);
}

.paginationInfo {
  font-size: 0.8125rem;
  color: var(--color-fg-secondary);
}

.paginationButtons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pageButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-fg-secondary);
  transition: all 0.15s;
}

.pageButton:hover {
  background: var(--color-neutral-100);
  color: var(--color-fg);
}

.pageButtonActive {
  background: var(--color-primary-600);
  color: #ffffff;
}
```

- 표시 형식: `1-20 / 총 345건`
- 이전/다음: `ChevronLeft` / `ChevronRight` (lucide-react, size 16)

### 8.5 반응형 테이블

```css
@media (max-width: 767px) {
  .tableWrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    min-width: 640px;
  }
}
```

---

## 9. 유저 관리 페이지

### 9.1 테이블 컬럼

| 컬럼   | 너비  | 정렬 | 내용                           |
| ------ | ----- | ---- | ------------------------------ |
| 이름   | 자동  | 좌   | 이름 + 이메일 (2줄)            |
| 가입일 | 120px | 좌   | YYYY.MM.DD 형식                |
| 플랜   | 100px | 중앙 | 뱃지 (무료/베이직/프리미엄)    |
| 생기부 | 80px  | 중앙 | 건수                           |
| 상태   | 100px | 중앙 | 활성/비활성 뱃지               |
| 액션   | 80px  | 중앙 | 상세보기 링크 또는 더보기 메뉴 |

### 9.2 유저 이름 셀 (2줄 표시)

```css
.userCell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.userName {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-fg);
}

.userEmail {
  font-size: 0.75rem;
  color: var(--color-fg-tertiary);
}
```

---

## 10. 생기부 관리 페이지

### 10.1 테이블 컬럼

| 컬럼     | 너비  | 정렬 | 내용                      |
| -------- | ----- | ---- | ------------------------- |
| ID       | 80px  | 좌   | 축약된 UUID 또는 순번     |
| 유저     | 자동  | 좌   | 이름 (링크)               |
| 학년     | 80px  | 중앙 | 1/2/3                     |
| 업로드일 | 120px | 좌   | YYYY.MM.DD                |
| 상태     | 100px | 중앙 | 분석완료/분석중/에러 뱃지 |
| 액션     | 80px  | 중앙 | 상세보기                  |

---

## 11. 리포트 관리 페이지

### 11.1 목록 테이블 컬럼

| 컬럼   | 너비  | 정렬 | 내용                          |
| ------ | ----- | ---- | ----------------------------- |
| ID     | 80px  | 좌   | 순번                          |
| 유저   | 자동  | 좌   | 이름                          |
| 유형   | 100px | 좌   | 리포트 타입                   |
| 생성일 | 120px | 좌   | YYYY.MM.DD                    |
| 상태   | 120px | 중앙 | 작성중/검수대기/발송완료 뱃지 |
| 액션   | 120px | 중앙 | 검수하기 / 이메일 발송 버튼   |

### 11.2 검수 상세 페이지

```
+-----------------------------------------------------------+
|  [뒤로가기]  리포트 검수 - #123                           |
+-----------------------------------------------------------+
|                                                           |
|  [유저 정보 카드]           [리포트 상태 & 액션]          |
|  이름: 홍길동               상태: 검수 대기 [뱃지]       |
|  이메일: hong@...           [이메일 발송 버튼]            |
|  생성일: 2026.02.25                                       |
|                                                           |
|  [리포트 내용 미리보기]                                   |
|  (카드 형태, 스크롤 가능 영역)                            |
|                                                           |
+-----------------------------------------------------------+
```

### 11.3 이메일 발송 버튼

```css
.sendEmailButton {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--color-primary-600);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.15s;
}

.sendEmailButton:hover {
  background: var(--color-primary-700);
}

.sendEmailButton:disabled {
  background: var(--color-neutral-200);
  color: var(--color-neutral-400);
  cursor: not-allowed;
}
```

---

## 12. 공통 컴포넌트 스타일

### 12.1 버튼

```css
/* Primary */
.buttonPrimary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--color-primary-600);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.15s;
}

.buttonPrimary:hover {
  background: var(--color-primary-700);
}

/* Secondary (Outline) */
.buttonSecondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--admin-card-bg);
  color: var(--color-fg-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s;
}

.buttonSecondary:hover {
  border-color: var(--color-border-strong);
  color: var(--color-fg);
  background: var(--color-neutral-50);
}

/* Ghost (텍스트 버튼) */
.buttonGhost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--color-fg-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s;
}

.buttonGhost:hover {
  background: var(--color-neutral-100);
  color: var(--color-fg);
}
```

### 12.2 입력 필드

```css
.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-fg);
  background: var(--admin-card-bg);
  transition: border-color 0.15s;
}

.input::placeholder {
  color: var(--color-fg-tertiary);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgb(79 70 229 / 0.1);
}
```

### 12.3 셀렉트/드롭다운

```css
.select {
  appearance: none;
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-fg);
  background: var(--admin-card-bg) url("data:image/svg+xml,...") no-repeat right
    10px center;
  background-size: 16px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.select:focus {
  outline: none;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgb(79 70 229 / 0.1);
}
```

### 12.4 빈 상태 (Empty State)

```css
.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 24px;
  text-align: center;
}

.emptyIcon {
  color: var(--color-neutral-300);
}

.emptyTitle {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-fg);
}

.emptyDesc {
  font-size: 0.875rem;
  color: var(--color-fg-secondary);
}
```

---

## 13. 간격 규칙

| 맥락                       | 간격      |
| -------------------------- | --------- |
| 페이지 제목 ~ 첫 번째 섹션 | 24px      |
| 카드 간 간격               | 16px      |
| 섹션 간 간격               | 24px      |
| 카드 내부 패딩             | 20px      |
| 테이블 셀 패딩             | 12px 16px |
| 사이드바 메뉴 아이템 간격  | 2px       |
| 사이드바 섹션 간격         | 24px      |
| 콘텐츠 영역 전체 패딩      | 24px      |

---

## 14. 인터랙션 & 애니메이션

- **모든 transition**: 0.15s ease (기존 컴포넌트와 동일)
- **호버 효과**: 배경색 변경 또는 border-color 변경
- **페이지 전환**: Framer Motion `fadeIn` (opacity 0 -> 1, 0.2s)
- **사이드바 모바일 슬라이드**: `transform: translateX` with 0.2s ease
- **드롭다운/모달**: 기존 Header.module.css의 `dropdownIn` 키프레임 재사용
- **로딩 스피너**: lucide-react `Loader2` 아이콘 + CSS `animation: spin 1s linear infinite`

---

## 15. 파일 구조 요약

```
app/admin/
├── layout.tsx                     # AdminLayout (사이드바 + 헤더 + 콘텐츠)
├── admin-layout.module.css        # 레이아웃 스타일
├── page.tsx                       # 대시보드 (리다이렉트 또는 직접 렌더)
├── dashboard/
│   ├── page.tsx                   # 대시보드 페이지
│   └── dashboard.module.css
├── users/
│   ├── page.tsx                   # 유저 목록
│   └── users.module.css
├── records/
│   ├── page.tsx                   # 생기부 목록
│   └── records.module.css
├── reports/
│   ├── page.tsx                   # 리포트 목록
│   ├── [id]/
│   │   └── page.tsx               # 리포트 검수 상세
│   └── reports.module.css
└── _components/                   # 어드민 공통 컴포넌트
    ├── AdminSidebar.tsx
    ├── AdminHeader.tsx
    ├── StatCard.tsx
    ├── DataTable.tsx
    ├── Badge.tsx
    ├── Pagination.tsx
    └── EmptyState.tsx
```
