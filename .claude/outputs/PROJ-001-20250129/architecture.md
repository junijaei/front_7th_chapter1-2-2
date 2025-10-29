# Technical Architecture

**프로젝트명**: 캘린더 반복 일정 기능
**버전**: 2.0.0
**작성일**: 2025-01-29 (업데이트)
**작성자**: Architect Agent
**프로젝트 ID**: PROJ-001-20250129
**티켓**: PROJ-002

---

## 1. 개요

### 1.1 문서 목적
이 문서는 캘린더 반복 일정 기능의 기술 아키텍처를 정의한다.

### 1.2 참조 문서
- **PRD**: `.claude/outputs/PROJ-001-20250129/prd.md`

### 1.3 아키텍처 원칙
- **모듈화 및 관심사 분리**: 날짜 로직, UI, 상태 관리 명확히 분리
- **테스트 가능성**: 날짜 계산 로직은 순수 함수로 구현
- **확장 가능성**: 향후 복잡한 반복 패턴 추가를 위한 구조
- **성능 우선**: 대량 반복 일정 생성 시에도 빠른 렌더링
- **타입 안정성**: TypeScript를 활용한 런타임 오류 최소화

---

## 2. 기술 스택

### 2.1 코어 기술

| 카테고리 | 기술 | 버전 | 선택 근거 |
|---------|------|------|-----------|
| 프레임워크 | React | 18.x | 캘린더 UI에 적합한 선언적 렌더링 |
| 언어 | TypeScript | 5.x | 타입 안정성, 날짜 로직 오류 방지 |
| 빌드 도구 | Vite | 5.x | 빠른 HMR, 최적화된 빌드 |

### 2.2 상태 관리

| 라이브러리 | 버전 | 용도 | 선택 근거 |
|-----------|------|------|-----------|
| Zustand | 4.x | 전역 상태 관리 | 보일러플레이트 최소, 간단한 API, 작은 번들 사이즈 (~1KB) |

### 2.3 UI 및 스타일링

| 카테고리 | 라이브러리 | 버전 | 선택 근거 |
|---------|-----------|------|-----------|
| 스타일링 | Tailwind CSS | 3.x | 유틸리티 우선, 빠른 프로토타이핑 |
| 아이콘 | lucide-react | 0.x | Tree-shakable, 순환 아이콘 제공 |

### 2.4 유틸리티

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| date-fns | 3.x | 날짜 처리, 윤년 계산, 월말 처리 |
| clsx | 2.x | 조건부 클래스명 관리 |

### 2.5 개발 도구

| 도구 | 버전 | 용도 |
|-----|------|------|
| ESLint | 8.x | 코드 품질 검사 |
| Prettier | 3.x | 코드 포맷팅 |
| Vitest | 1.x | 단위 테스트 |

---

## 3. 시스템 아키텍처

### 3.1 전체 구조도

```
┌─────────────────────────────────────────────────────────┐
│              Presentation Layer                          │
│  (Calendar View, Event Forms, Modals)                   │
├─────────────────────────────────────────────────────────┤
│           Business Logic Layer                           │
│  (Recurrence Logic, Date Calculation, Hooks)            │
├─────────────────────────────────────────────────────────┤
│               Data Layer                                 │
│  (Event Store, LocalStorage)                            │
└─────────────────────────────────────────────────────────┘
```

### 3.2 계층별 책임

#### Presentation Layer
- 캘린더 뷰 렌더링
- 일정 생성/수정/삭제 폼
- 반복 일정 아이콘 표시
- 단일/전체 수정 확인 다이얼로그

#### Business Logic Layer
- 반복 일정 생성 알고리즘
- 윤년 및 월말 처리 로직
- 단일/전체 수정 시 데이터 분리
- 반복 종료 조건 계산

#### Data Layer
- 일정 데이터 저장 및 조회 (LocalStorage)
- 반복 일정 메타데이터 관리

---

## 4. 컴포넌트 아키텍처

### 4.1 컴포넌트 계층 구조

```
App
├── Layout
│   ├── Header
│   └── Navigation
├── CalendarPage
│   ├── CalendarView
│   │   ├── CalendarGrid
│   │   │   ├── DateCell
│   │   │   └── EventCard (반복 아이콘 포함)
│   │   └── MonthHeader
│   └── EventForm (Modal)
│       ├── BasicInfoSection
│       ├── RecurrenceSelector
│       └── FormActions
└── Common Components
    ├── Button, Input, Select
    ├── DatePicker
    ├── Modal
    └── ConfirmDialog
```

### 4.2 주요 컴포넌트

**페이지 컴포넌트**:
- `CalendarPage`: 캘린더 메인 페이지

**기능 컴포넌트**:
- `CalendarView`: 캘린더 그리드 렌더링
- `EventForm`: 일정 생성/수정 폼
- `RecurrenceSelector`: 반복 유형 선택
- `EventCard`: 일정 카드 (반복 아이콘)

**공통 컴포넌트**:
- `Button`, `Input`, `Select`, `DatePicker`, `Modal`, `ConfirmDialog`

---

## 5. 상태 관리

### 5.1 상태 구조

```typescript
interface EventStore {
  // 상태
  events: Event[];
  currentMonth: Date;

  // 액션
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  updateSingleRecurrence: (eventId: string, date: string, updates: Partial<Event>) => void;
  deleteSingleRecurrence: (eventId: string, date: string) => void;
  setCurrentMonth: (month: Date) => void;
}
```

**전역 상태 (Zustand)**: 일정 목록, 현재 월
**로컬 상태 (useState)**: 폼 입력값, 모달 상태, 드롭다운 상태

---

## 6. 데이터 모델

### 6.1 Event 인터페이스

```typescript
interface Event {
  id: string;
  title: string;
  startDate: string;             // ISO 8601 (YYYY-MM-DD)
  endDate: string;
  isRecurring: boolean;
  recurrence?: RecurrenceRule;
}

interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  endDate: string;               // 최대 2025-12-31
  exceptions: string[];          // 단일 삭제된 날짜 목록
}
```

### 6.2 반복 일정 생성 로직

**월말 처리**:
- 31일에 매월 반복: 31일이 없는 달(2, 4, 6, 9, 11월)은 스킵

**윤년 처리**:
- 2월 29일에 매년 반복: 윤년에만 생성

**단일 수정**:
- 원본 Event의 `recurrence.exceptions`에 해당 날짜 추가
- 새로운 SingleEvent 생성 (`isRecurring: false`)

**전체 수정**:
- 원본 Event 객체 전체 업데이트

---

## 7. 디렉토리 구조

```
src/
├── components/
│   ├── common/               # Button, Input, Modal 등
│   └── layout/               # Header, Navigation
├── features/
│   └── calendar/
│       ├── components/       # CalendarView, EventForm 등
│       ├── hooks/            # useCalendar, useEventForm
│       ├── services/         # recurrenceService, storageService
│       ├── utils/            # dateUtils, eventUtils
│       └── types/            # event.types.ts
├── store/
│   ├── eventStore.ts         # Zustand store
│   └── middleware.ts         # LocalStorage 미들웨어
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
```

**파일 명명 규칙**:
- 컴포넌트: PascalCase (`EventCard.tsx`)
- 훅: camelCase + use (`useCalendar.ts`)
- 서비스: camelCase + Service (`recurrenceService.ts`)
- 유틸: camelCase (`dateUtils.ts`)

---

## 8. 성능 최적화

### 8.1 렌더링 최적화

| 기법 | 적용 대상 | 이유 |
|-----|----------|------|
| React.memo | EventCard | 날짜 셀 리렌더링 최소화 |
| useMemo | generateRecurrences | 반복 일정 생성 계산 비용 높음 |
| useCallback | 이벤트 핸들러 | 자식 컴포넌트 Props 최적화 |

### 8.2 데이터 최적화
- 현재 보이는 월의 일정만 생성
- LocalStorage 자동 저장 (Debounce 500ms)
- 생성된 반복 일정 월별 캐싱

### 8.3 번들 최적화
- date-fns: Tree Shaking (필요한 함수만 import)
- 현재 Code Splitting 불필요 (단일 페이지)

---

## 9. 보안 및 품질

### 9.1 보안

| 위협 | 방어 방법 |
|-----|----------|
| XSS | React 기본 이스케이프, dangerouslySetInnerHTML 금지 |
| 로컬 데이터 조작 | 클라이언트 전용, 향후 서버 연동 시 검증 추가 |

### 9.2 접근성 (A11y)
- Semantic HTML: `<time>`, `<button>`, `<form>`
- ARIA 레이블: 네비게이션, 일정 카드, 반복 아이콘
- 키보드 네비게이션: 방향키, Enter, Esc
- 색상 대비: WCAG AA 기준 (4.5:1 이상)

### 9.3 코드 품질
- TypeScript: 모든 파일 명시적 타입 선언
- ESLint: `no-explicit-any`, `react-hooks/rules-of-hooks`
- 단위 테스트 목표: 70% 이상 (dateUtils, recurrenceService 필수)

---

## 10. 개발 가이드라인

### 10.1 코딩 컨벤션
**상세**: `.claude/docs/code-quality/frontend-code.md` 참조

- 함수: camelCase
- 컴포넌트: PascalCase
- 상수: UPPER_SNAKE_CASE
- 타입: PascalCase

### 10.2 Git 브랜치 전략
- `main`: 프로덕션
- `develop`: 개발 통합
- `feature/PROJ-XXX-description`: 기능 개발
- `fix/PROJ-XXX-description`: 버그 수정

### 10.3 커밋 컨벤션
**상세**: `.claude/docs/git-commit-convention.md` 참조

---

## 11. 제약사항

### 11.1 기술적 제약
- 브라우저: 모던 브라우저 최신 2개 버전
- 반응형: 모바일, 태블릿, 데스크톱

### 11.2 기능 제약 (PRD 기준)
- 반복 종료일: 최대 2025-12-31
- 반복 유형: 4가지만 (매일, 매주, 매월, 매년)
- 일정 겹침: 검사 안 함
- 무한 반복: 지원 안 함

### 11.3 성능 요구사항
- FCP: < 1.5초
- TTI: < 3.0초
- LCP: < 2.5초
- 반복 일정 생성: 1000개 생성 시 < 100ms

---

## 12. 향후 고려사항

### 12.1 확장 가능성
- 복잡한 반복 패턴 (격주, 특정 요일 조합)
- 반복 일정 예외 처리 (공휴일 건너뛰기)
- 백엔드 연동 및 실시간 동기화

### 12.2 마이그레이션 계획
- 단기 (3개월): Vitest 커버리지 70%, Storybook 도입
- 중기 (6개월): 백엔드 API 연동, 사용자 인증
- 장기 (1년): PWA 변환, 알림 기능, 일정 공유

---

## 13. 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2025-01-29 | Architect | 초안 작성 |
| 2.0.0 | 2025-01-29 | Architect | 간결한 버전으로 업데이트 |

---

**다음 단계**: UX Expert에게 전달하여 UX Design 작성
