# Technical Architecture

**프로젝트명**: 캘린더 반복 일정 기능
**버전**: 1.0.0
**작성일**: 2025-01-29
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
1. **모듈화 및 관심사 분리**: 날짜 로직, UI 컴포넌트, 상태 관리를 명확히 분리
2. **테스트 가능성**: 날짜 계산 로직은 순수 함수로 구현하여 단위 테스트 용이성 확보
3. **확장 가능성**: 향후 복잡한 반복 패턴 추가를 위한 구조 설계
4. **성능 우선**: 대량의 반복 일정 생성 시에도 빠른 렌더링 보장
5. **타입 안정성**: TypeScript를 활용한 런타임 오류 최소화

---

## 2. 기술 스택

### 2.1 코어 기술

| 카테고리 | 기술 | 버전 | 선택 근거 |
|---------|------|------|-----------|
| 프레임워크 | React | 18.x | 컴포넌트 기반 아키텍처, 풍부한 생태계, 캘린더 UI에 적합한 선언적 렌더링 |
| 언어 | TypeScript | 5.x | 타입 안정성, 날짜 관련 복잡한 로직의 오류 방지, 개발 생산성 향상 |
| 빌드 도구 | Vite | 5.x | 빠른 HMR, 간단한 설정, 최적화된 빌드 성능 |

### 2.2 상태 관리

| 라이브러리 | 버전 | 용도 | 선택 근거 |
|-----------|------|------|-----------|
| Zustand | 4.x | 전역 상태 관리 | 보일러플레이트 최소, 간단한 API, 번들 사이즈 작음 (~1KB), 캘린더 일정 관리에 충분 |

### 2.3 UI 라이브러리 및 스타일링

| 카테고리 | 라이브러리 | 버전 | 선택 근거 |
|---------|-----------|------|-----------|
| Component Library | 없음 | - | 캘린더 UI의 커스터마이징 요구사항이 높아 직접 구현 |
| 스타일링 | Tailwind CSS | 3.x | 유틸리티 우선 접근, 빠른 프로토타이핑, 일관된 디자인 시스템 |
| 아이콘 | lucide-react | 0.x | Tree-shakable, 가벼움, 순환 아이콘 제공 |

### 2.4 유틸리티 라이브러리

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| date-fns | 3.x | 날짜/시간 처리, 윤년 계산, 월말 처리 |
| clsx | 2.x | 조건부 클래스명 관리 |

### 2.5 개발 도구

| 도구 | 버전 | 용도 |
|-----|------|------|
| ESLint | 8.x | 코드 품질 검사 |
| Prettier | 3.x | 코드 포맷팅 |
| Vitest | 1.x | 단위 테스트 프레임워크 |

### 2.6 선택하지 않은 대안 및 이유

| 대안 기술 | 선택하지 않은 이유 |
|----------|-------------------|
| Redux Toolkit | Zustand에 비해 보일러플레이트가 많고, 캘린더 일정 관리에는 과도한 복잡도 |
| Day.js | date-fns가 tree-shaking에 더 유리하고, 함수형 API가 더 직관적 |
| Luxon | 번들 사이즈가 크고, 캘린더 기능에는 date-fns로 충분 |
| Styled-Components | Tailwind CSS가 빠른 개발과 일관성에서 더 유리 |
| Material-UI | 캘린더 UI 커스터마이징에 제약이 많고, 번들 사이즈 증가 |

---

## 3. 시스템 아키텍처

### 3.1 전체 구조도

```
┌─────────────────────────────────────────────────────────┐
│              Presentation Layer                          │
│  (Calendar View, Event Forms, Modals, Icons)            │
├─────────────────────────────────────────────────────────┤
│           Business Logic Layer                           │
│  (Recurrence Logic, Date Calculation, Hooks)            │
├─────────────────────────────────────────────────────────┤
│               Data Layer                                 │
│  (Event Store, LocalStorage, Cache)                     │
└─────────────────────────────────────────────────────────┘
```

### 3.2 계층별 책임

#### 3.2.1 Presentation Layer
**책임**:
- 캘린더 뷰 렌더링 (월간 뷰)
- 일정 생성/수정/삭제 폼 표시
- 반복 일정 아이콘 표시
- 단일/전체 수정 확인 다이얼로그
- 사용자 입력 처리

**주요 구성요소**:
- `CalendarView`: 월간 캘린더 뷰
- `EventForm`: 일정 생성/수정 폼
- `RecurrenceSelector`: 반복 유형 선택 UI
- `ConfirmDialog`: 단일/전체 선택 다이얼로그
- `EventCard`: 일정 카드 (아이콘 포함)

#### 3.2.2 Business Logic Layer
**책임**:
- 반복 일정 생성 알고리즘
- 윤년 및 월말 처리 로직
- 단일/전체 수정 시 데이터 분리 로직
- 반복 종료 조건 계산
- 예외 날짜 관리

**주요 구성요소**:
- `useEventStore`: 일정 상태 관리 훅
- `recurrenceService`: 반복 일정 생성 서비스
- `dateUtils`: 날짜 유틸리티 함수
- `eventUtils`: 일정 처리 유틸리티

#### 3.2.3 Data Layer
**책임**:
- 일정 데이터 저장 및 조회
- 로컬 데이터 영속성 (LocalStorage)
- 반복 일정 메타데이터 관리

**주요 구성요소**:
- `EventStore`: Zustand 기반 전역 스토어
- `storageService`: LocalStorage 관리
- Event 데이터 모델

---

## 4. 컴포넌트 아키텍처

### 4.1 컴포넌트 계층 구조

```
App
├── Layout
│   ├── Header
│   └── Navigation (Month Navigation)
├── Pages
│   └── CalendarPage
│       ├── CalendarView
│       │   ├── CalendarGrid
│       │   │   ├── DateCell
│       │   │   │   └── EventCard (반복 아이콘 포함)
│       │   │   └── ...
│       │   └── MonthHeader
│       └── EventForm (Modal)
│           ├── BasicInfoSection
│           ├── RecurrenceSelector
│           │   ├── RecurrenceTypeSelect
│           │   └── RecurrenceEndDatePicker
│           └── FormActions
└── Common Components
    ├── Button
    ├── Input
    ├── Select
    ├── DatePicker
    ├── Modal
    └── ConfirmDialog
```

### 4.2 컴포넌트 분류

#### 4.2.1 페이지 컴포넌트 (Pages)
- **CalendarPage**: 캘린더 메인 페이지
  - 책임: 캘린더 뷰와 이벤트 폼 조합, 월 네비게이션 상태 관리

#### 4.2.2 기능 컴포넌트 (Features)
- **CalendarView**: 캘린더 그리드 렌더링
- **EventForm**: 일정 생성/수정 폼
- **RecurrenceSelector**: 반복 유형 선택 컴포넌트
- **EventCard**: 일정 카드 (제목, 시간, 반복 아이콘)

#### 4.2.3 공통 컴포넌트 (Common)
- **Button, Input, Select**: 기본 폼 요소
- **DatePicker**: 날짜 선택 컴포넌트 (date-fns 기반)
- **Modal**: 범용 모달 컨테이너
- **ConfirmDialog**: 확인 다이얼로그 (단일/전체 선택용)

### 4.3 컴포넌트 설계 원칙

1. **단일 책임 원칙**: CalendarGrid는 렌더링만, 데이터 처리는 CalendarView에서
2. **Props 최소화**: EventCard는 event 객체만 받고 내부에서 표시 로직 처리
3. **합성 우선**: EventForm은 작은 섹션 컴포넌트 조합
4. **컨테이너/프레젠테이셔널 분리**: CalendarPage(컨테이너) / CalendarView(프레젠테이셔널)

---

## 5. 상태 관리

### 5.1 상태 관리 전략

```
[전역 상태 - Zustand]     [로컬 상태 - useState]
- 일정 목록                 - 폼 입력값
- 현재 선택된 월            - 모달 열림/닫힘
- 필터 조건 (미래용)        - 드롭다운 열림/닫힘
                            - 날짜 피커 선택 상태
```

### 5.2 상태 관리 구조

#### 5.2.1 전역 상태 (Zustand)

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

  // 셀렉터
  getEventsForMonth: (month: Date) => Event[];
  getEventsForDate: (date: Date) => Event[];
}
```

#### 5.2.2 로컬 상태
- React Hook (`useState`) 사용
- 폼 입력, UI 상태 (모달, 드롭다운 등)
- 일시적이고 컴포넌트에 한정된 상태

### 5.3 상태 업데이트 흐름

```
User Action (폼 제출)
  → EventForm
  → addEvent/updateEvent 액션 호출
  → EventStore 업데이트
  → CalendarView 리렌더링
```

---

## 6. 데이터 흐름

### 6.1 데이터 모델

#### 6.1.1 Event 인터페이스

```typescript
interface Event {
  id: string;                    // UUID
  title: string;
  startDate: string;             // ISO 8601 (YYYY-MM-DD)
  endDate: string;               // ISO 8601 (동일 날짜)
  isRecurring: boolean;
  recurrence?: RecurrenceRule;
}

interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  endDate: string;               // 최대 2025-12-31
  exceptions: string[];          // 단일 삭제된 날짜 목록
}

// 단일 수정으로 분리된 이벤트
interface SingleEvent extends Event {
  isRecurring: false;
  originalRecurringId?: string;  // 원본 반복 일정 ID (참조용)
}
```

### 6.2 반복 일정 생성 로직

#### 6.2.1 알고리즘 개요

```typescript
// recurrenceService.ts
function generateRecurrences(
  event: Event,
  startDate: Date,
  endDate: Date
): Date[] {
  const { type, endDate: ruleEndDate } = event.recurrence;
  const dates: Date[] = [];
  let current = startDate;

  while (current <= min(endDate, parseISO(ruleEndDate))) {
    // 예외 날짜 확인
    if (!event.recurrence.exceptions.includes(formatISO(current))) {
      // 유효성 검증 (윤년, 월말 처리)
      if (isValidRecurrenceDate(current, type, startDate)) {
        dates.push(current);
      }
    }
    current = getNextRecurrence(current, type);
  }

  return dates;
}
```

#### 6.2.2 월말 및 윤년 처리

```typescript
function isValidRecurrenceDate(
  date: Date,
  type: RecurrenceType,
  originalDate: Date
): boolean {
  if (type === 'monthly') {
    const originalDay = getDate(originalDate);
    // 31일 규칙: 31일이 없는 달은 스킵
    if (originalDay === 31 && !isLastDayOfMonth(date)) {
      return false;
    }
  }

  if (type === 'yearly') {
    // 윤년 규칙: 2월 29일은 윤년에만
    if (getMonth(originalDate) === 1 && getDate(originalDate) === 29) {
      return isLeapYear(getYear(date));
    }
  }

  return true;
}
```

### 6.3 단일/전체 수정 처리

#### 6.3.1 단일 수정 흐름

```
1. 사용자가 반복 일정 수정 클릭
2. ConfirmDialog 표시: "해당 일정만 수정하시겠어요?"
3. "예" 선택 시:
   a. 원본 Event의 recurrence.exceptions에 해당 날짜 추가
   b. 새로운 SingleEvent 생성 (isRecurring: false)
   c. originalRecurringId에 원본 ID 저장
4. EventStore.updateSingleRecurrence() 호출
```

#### 6.3.2 전체 수정 흐름

```
1. "아니오" 선택 시:
   a. EventStore.updateEvent() 호출
   b. 원본 Event 객체 전체 업데이트
   c. recurrence 필드 유지
```

### 6.4 데이터 영속성

#### 6.4.1 LocalStorage 저장

```typescript
// storageService.ts
const STORAGE_KEY = 'calendar_events';

function saveEvents(events: Event[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function loadEvents(): Event[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
```

#### 6.4.2 자동 저장 전략
- Zustand 미들웨어 사용하여 상태 변경 시 자동 저장
- Debounce 적용 (500ms)

---

## 7. 라우팅 설계

### 7.1 라우팅 구조

| 경로 | 컴포넌트 | 설명 | 접근 권한 |
|-----|---------|------|----------|
| `/` | CalendarPage | 캘린더 메인 페이지 (월간 뷰) | Public |

**참고**: 단일 페이지 애플리케이션으로 설계 (추가 라우트 없음)

### 7.2 동적 라우팅
현재 버전에서는 동적 라우팅 불필요. 향후 확장 시 고려:
```
/calendar/:year/:month  # 특정 월 직접 접근
/events/:eventId        # 이벤트 상세 페이지
```

### 7.3 라우팅 가드
- 현재 버전: 인증 불필요 (Public)
- 향후 확장 시 인증 추가 고려

---

## 8. 디렉토리 구조

```
src/
├── assets/
│   └── icons/                # 커스텀 아이콘 (필요 시)
├── components/
│   ├── common/               # 공통 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── DatePicker.tsx
│   │   ├── Modal.tsx
│   │   └── ConfirmDialog.tsx
│   └── layout/               # 레이아웃 컴포넌트
│       ├── Header.tsx
│       └── Navigation.tsx
├── features/
│   └── calendar/             # 캘린더 기능
│       ├── components/
│       │   ├── CalendarView.tsx
│       │   ├── CalendarGrid.tsx
│       │   ├── DateCell.tsx
│       │   ├── EventCard.tsx
│       │   ├── EventForm.tsx
│       │   └── RecurrenceSelector.tsx
│       ├── hooks/
│       │   ├── useCalendar.ts
│       │   └── useEventForm.ts
│       ├── services/
│       │   ├── recurrenceService.ts
│       │   └── storageService.ts
│       ├── utils/
│       │   ├── dateUtils.ts
│       │   └── eventUtils.ts
│       └── types/
│           └── event.types.ts
├── store/
│   ├── eventStore.ts         # Zustand store
│   └── middleware.ts         # LocalStorage 미들웨어
├── types/
│   └── common.types.ts       # 공통 타입
├── styles/
│   └── global.css            # Tailwind 설정
├── App.tsx
└── main.tsx
```

### 8.1 파일 명명 규칙
- 컴포넌트: PascalCase (`EventCard.tsx`)
- 훅: camelCase + use 접두사 (`useCalendar.ts`)
- 서비스: camelCase + Service 접미사 (`recurrenceService.ts`)
- 유틸리티: camelCase (`dateUtils.ts`)
- 타입: camelCase + .types 접미사 (`event.types.ts`)

---

## 9. 성능 최적화

### 9.1 렌더링 최적화

| 기법 | 적용 대상 | 설명 |
|-----|----------|------|
| React.memo | EventCard | Props 변경 시에만 리렌더링 (날짜 셀 최적화) |
| useMemo | generateRecurrences | 반복 일정 생성은 계산 비용이 높으므로 메모이제이션 |
| useCallback | 이벤트 핸들러 | 자식 컴포넌트에 전달하는 콜백 함수 최적화 |

### 9.2 반복 일정 렌더링 최적화

```typescript
// 최적화 전략
// 1. 현재 보이는 월의 일정만 생성
const visibleEvents = useMemo(() => {
  return events.flatMap(event => {
    if (event.isRecurring) {
      return generateRecurrences(event, startOfMonth, endOfMonth);
    }
    return [event];
  });
}, [events, currentMonth]);

// 2. Virtual Scrolling (향후 연간 뷰 추가 시)
// react-window 또는 react-virtual 사용 고려
```

### 9.3 번들 최적화
- Tree Shaking: date-fns의 필요한 함수만 import
- Dynamic Import: 현재 불필요 (단일 페이지)
- Code Splitting: 향후 기능 확장 시 적용

### 9.4 데이터 최적화
- LocalStorage 읽기: 앱 초기화 시 1회만 수행
- 상태 업데이트: Immer 패턴 사용 (Zustand 내장)
- 메모리 캐시: 생성된 반복 일정을 월별로 캐싱

---

## 10. 보안 및 품질

### 10.1 보안 고려사항

| 위협 | 방어 방법 |
|-----|----------|
| XSS | React의 기본 이스케이프 처리 활용, dangerouslySetInnerHTML 사용 금지 |
| 로컬 데이터 조작 | 현재 버전: 클라이언트 전용이므로 해당 없음. 향후 서버 연동 시 검증 추가 |
| 민감 데이터 노출 | 일정 데이터에 민감 정보 포함 시 암호화 고려 (현재 버전: 해당 없음) |

### 10.2 접근성 (A11y)

- **Semantic HTML**: `<time>`, `<button>`, `<form>` 등 적절한 태그 사용
- **ARIA 레이블**:
  - 캘린더 네비게이션: `aria-label="이전 달"`, `aria-label="다음 달"`
  - 일정 카드: `aria-label="[날짜] [제목] 일정"`
  - 반복 아이콘: `aria-label="반복 일정"`
- **키보드 네비게이션**:
  - 방향키로 날짜 셀 이동
  - Enter로 일정 추가/수정
  - Esc로 모달 닫기
- **색상 대비**: WCAG AA 기준 준수 (4.5:1 이상)
- **포커스 표시**: 키보드 포커스 시 명확한 아웃라인

### 10.3 코드 품질

- **TypeScript 사용**: 모든 파일에 명시적 타입 선언
- **ESLint 규칙**:
  - `react-hooks/rules-of-hooks`: 훅 사용 규칙 준수
  - `@typescript-eslint/no-explicit-any`: any 사용 금지
- **Prettier**: 자동 포매팅 (탭 2칸, 세미콜론 사용)
- **단위 테스트**:
  - 목표 커버리지: 70% 이상
  - 필수 테스트 대상: dateUtils, recurrenceService, eventUtils

---

## 11. 개발 가이드라인

### 11.1 코딩 컨벤션
**상세 가이드**: `.claude/docs/code-quality/frontend-code.md` 참조

**요약**:
- 함수: camelCase (`generateRecurrences`)
- 컴포넌트: PascalCase (`EventCard`)
- 상수: UPPER_SNAKE_CASE (`MAX_END_DATE`)
- 타입/인터페이스: PascalCase (`Event`, `RecurrenceRule`)
- 파일명: 컴포넌트는 PascalCase, 나머지는 camelCase

### 11.2 Git 브랜치 전략
- `main`: 프로덕션 브랜치 (항상 배포 가능 상태)
- `develop`: 개발 통합 브랜치
- `feature/PROJ-XXX-description`: 기능 개발 브랜치
- `fix/PROJ-XXX-description`: 버그 수정 브랜치

### 11.3 커밋 컨벤션
**상세 규칙**: `.claude/docs/git-commit-convention.md` 참조

**예시**:
```
feat(PROJ-007): [Developer] 반복 유형 선택 UI 구현
test(PROJ-007): [Developer] 윤년 처리 로직 단위 테스트 추가
```

---

## 12. 의존성 및 제약사항

### 12.1 외부 의존성

| 라이브러리 | 용도 | 제약사항 |
|----------|------|----------|
| date-fns | 날짜 계산 | 필요한 함수만 import (tree-shaking) |
| lucide-react | 아이콘 | RefreshCw (순환 아이콘) 필수 |
| Zustand | 상태 관리 | 미들웨어 사용 시 타입 주의 |

### 12.2 브라우저 지원
- Chrome: 최신 2개 버전
- Firefox: 최신 2개 버전
- Safari: 최신 2개 버전 (iOS Safari 포함)
- Edge: 최신 2개 버전

### 12.3 성능 요구사항
- **First Contentful Paint (FCP)**: < 1.5초
- **Time to Interactive (TTI)**: < 3.0초
- **Largest Contentful Paint (LCP)**: < 2.5초
- **반복 일정 생성**: 1000개 일정 생성 시 < 100ms

### 12.4 기능 제약사항 (PRD 기준)
- 반복 종료 날짜: 최대 2025-12-31
- 반복 유형: 4가지만 지원 (매일, 매주, 매월, 매년)
- 일정 겹침: 검사 안 함
- 무한 반복: 지원 안 함

---

## 13. 향후 고려사항

### 13.1 확장성

#### 13.1.1 복잡한 반복 패턴
- 격주 반복 (`every: 2, unit: 'week'`)
- 특정 요일 조합 (`daysOfWeek: [1, 3, 5]` - 월/수/금)
- 월의 N번째 요일 (`weekOfMonth: 2, dayOfWeek: 1` - 둘째 주 월요일)

**구현 방향**:
```typescript
interface AdvancedRecurrence extends RecurrenceRule {
  interval?: number;          // 격주, 격월 등
  daysOfWeek?: number[];      // 0-6 (일-토)
  weekOfMonth?: number;       // 1-5
}
```

#### 13.1.2 반복 일정 예외 처리
- 특정 날짜 건너뛰기 (공휴일 등)
- 예외 날짜 목록 UI 제공

#### 13.1.3 백엔드 연동
- RESTful API 설계
- 서버 측 반복 일정 생성 최적화
- 실시간 동기화 (WebSocket)

### 13.2 마이그레이션 계획

#### 13.2.1 단기 (3개월 이내)
- Vitest 테스트 커버리지 70% 달성
- Storybook 도입 (컴포넌트 문서화)

#### 13.2.2 중기 (6개월 이내)
- 백엔드 API 연동
- 사용자 인증 추가
- 다중 캘린더 지원

#### 13.2.3 장기 (1년 이내)
- PWA 변환 (오프라인 지원)
- 알림 기능 추가
- 일정 공유 기능

---

## 14. 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2025-01-29 | Architect Agent | 초안 작성 |

---

**다음 단계**: Product Owner에게 전달 (UX Design과 함께)
