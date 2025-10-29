# Story Refiner Agent Output Template

**버전:** 1.0.0
**생성일:** 2025-01-29
**목적:** Story Refiner 에이전트의 산출물 형식 및 구조 정의

---

## 산출물 개요

Story Refiner 에이전트는 **Story 상세 명세 문서**를 주요 산출물로 생성한다.

### 파일 정보
- **파일명**: `story-detail.md`
- **경로**: `.claude/outputs/{project-id}-{YYYYMMDD}/stories/{story-id}/story-detail.md`
- **예시**: `.claude/outputs/PROJ-001-20250129/stories/PROJ-007/story-detail.md`
- **티켓**: PROJ-005 (Story Refiner 자체) + 각 Story 티켓
- **목적**: 개발자가 즉시 개발을 시작할 수 있는 구체적인 구현 스펙 제공

---

## Story 상세 명세 문서 템플릿

```markdown
# Story 상세 명세: {Story ID} - {Story 제목}

**Story ID**: {PROJ-XXX}
**Epic**: {Epic-X} - {Epic 이름}
**버전**: 1.0.0
**작성일**: YYYY-MM-DD
**작성자**: Story Refiner Agent
**티켓**: {PROJ-XXX}

---

## 1. Story 개요

### 1.1 원본 Story 정보

**제목**: {User Story 형식: As a... I want... so that...}

**설명**:
{PO가 작성한 Story 설명 - 참조만, 중복 작성 금지}

**Acceptance Criteria**:
{PO가 작성한 AC - 참조만, 중복 작성 금지}

**참조**:
- **Epic/Story 목록**: `.claude/outputs/{project-id}-{YYYYMMDD}/epics-stories.md` (Story {PROJ-XXX} 섹션)

### 1.2 Story 분석 요약

**비즈니스 가치**: {이 Story가 제공하는 사용자/비즈니스 가치}

**기술적 복잡도**: Low / Medium / High

**예상 구현 시간**: {X일}

**주요 도전 과제**:
- {도전 과제 1}
- {도전 과제 2}

---

## 2. 기술 스펙

### 2.1 컴포넌트 구조

#### 2.1.1 필요한 컴포넌트 목록

| 컴포넌트명 | 타입 | 경로 | 책임 | 생성/수정 |
|-----------|------|------|------|----------|
| {ComponentName} | Page/Feature/Common | {파일 경로} | {책임 설명} | 생성/수정 |

**예시**:
| 컴포넌트명 | 타입 | 경로 | 책임 | 생성/수정 |
|-----------|------|------|------|----------|
| EventForm | Feature | `src/features/calendar/components/EventForm.tsx` | 일정 생성/수정 폼 | 수정 |
| RecurrenceSelector | Feature | `src/features/calendar/components/RecurrenceSelector.tsx` | 반복 유형 선택 드롭다운 | 생성 |

#### 2.1.2 컴포넌트 계층 구조

```
{ParentComponent}
├── {ChildComponent1}
│   └── {GrandchildComponent}
└── {ChildComponent2}
```

**예시**:
```
EventForm
├── BasicInfoSection
├── RecurrenceSelector (신규)
│   └── Dropdown (공통 컴포넌트)
└── FormActions
```

#### 2.1.3 주요 컴포넌트 상세

**{ComponentName}**

**Props 인터페이스**:
```typescript
interface {ComponentName}Props {
  {propName}: {type};  // {설명}
  {propName2}?: {type};  // {설명} (optional)
}
```

**State**:
- `{stateName}`: {type} - {설명}
- `{stateName2}`: {type} - {설명}

**주요 기능**:
- {기능 1 설명}
- {기능 2 설명}

**참조**:
- Architecture 섹션 {X.X}: {참조 내용}
- UX Design 섹션 {Y.Y}: {참조 내용}

### 2.2 상태 관리

#### 2.2.1 전역 상태 (Zustand)

**사용 여부**: Yes / No

**스토어 수정 사항**:
```typescript
// eventStore.ts에 추가/수정할 내용
interface EventStore {
  // 기존 상태
  events: Event[];

  // 추가할 상태
  {newState}: {type};

  // 추가할 액션
  {newAction}: ({params}) => void;
}
```

**액션 구현 방법**:
- `{actionName}`: {구현 설명}

#### 2.2.2 로컬 상태 (useState)

| State 이름 | 타입 | 초기값 | 용도 |
|-----------|------|--------|------|
| {stateName} | {type} | {initialValue} | {설명} |

**예시**:
| State 이름 | 타입 | 초기값 | 용도 |
|-----------|------|--------|------|
| recurrenceType | string | "none" | 선택된 반복 유형 |
| showEndDate | boolean | false | 종료 날짜 필드 표시 여부 |

#### 2.2.3 상태 업데이트 로직

**{stateName} 업데이트 시나리오**:
1. {트리거 이벤트}
2. {업데이트 로직}
3. {결과/사이드 이펙트}

### 2.3 데이터 흐름

#### 2.3.1 사용자 액션 → 상태 변경 흐름

```
{사용자 액션}
  ↓
{이벤트 핸들러}
  ↓
{상태 업데이트}
  ↓
{UI 리렌더링}
```

**예시**:
```
드롭다운에서 "매주" 선택
  ↓
handleRecurrenceChange("weekly")
  ↓
setRecurrenceType("weekly")
setShowEndDate(true)
  ↓
종료 날짜 필드가 Slide down 애니메이션으로 표시됨
```

#### 2.3.2 데이터 검증 및 에러 처리

**검증 시점**: {blur / submit / realtime}

**검증 규칙**:
- {필드명}: {검증 규칙}
- {필드명2}: {검증 규칙}

**에러 처리**:
- {에러 타입}: {처리 방법}
- {에러 타입2}: {처리 방법}

#### 2.3.3 API 호출 (해당 시)

**API 엔드포인트**: {endpoint}
**Method**: GET / POST / PUT / DELETE
**Request 구조**: {설명}
**Response 구조**: {설명}
**에러 처리**: {설명}

### 2.4 파일 구조

#### 2.4.1 생성할 파일

| 파일 경로 | 목적 | 주요 내용 |
|----------|------|----------|
| {파일 경로} | {목적} | {주요 내용} |

#### 2.4.2 수정할 파일

| 파일 경로 | 수정 내용 | 영향 범위 |
|----------|----------|----------|
| {파일 경로} | {수정 내용} | {영향 범위} |

---

## 3. 구현 가이드

### 3.1 단계별 구현 순서

#### Step 1: {단계 제목}

**목표**: {이 단계의 목표}

**구현 내용**:
1. {구체적인 작업 1}
   - {세부 사항}
   - {사용할 함수/라이브러리}
2. {구체적인 작업 2}
   - {세부 사항}

**완료 조건**:
- [ ] {조건 1}
- [ ] {조건 2}

**예상 시간**: {X시간}

---

#### Step 2: {단계 제목}

{위와 동일한 형식}

---

### 3.2 주요 구현 포인트

#### 3.2.1 {기능명} 구현

**구현 방법**:
{구체적인 구현 설명 - 코드는 작성하지 않지만 어떻게 구현하는지 설명}

**사용할 라이브러리/함수**:
- {라이브러리명}: {용도}
- {함수명}: {용도}

**참조**:
- Architecture 섹션 {X.X}
- UX Design 섹션 {Y.Y}

#### 3.2.2 {기능명2} 구현

{위와 동일한 형식}

### 3.3 주의사항 및 팁

**주의사항**:
- ⚠️ {주의사항 1}
- ⚠️ {주의사항 2}

**구현 팁**:
- 💡 {팁 1}
- 💡 {팁 2}

**흔한 실수**:
- ❌ {실수 1}
  - ✅ {올바른 방법}
- ❌ {실수 2}
  - ✅ {올바른 방법}

**성능 최적화**:
- {최적화 포인트 1}
- {최적화 포인트 2}

---

## 4. 테스트 가이드

### 4.1 단위 테스트

#### 4.1.1 테스트 대상

| 대상 | 테스트 파일 | 우선순위 |
|-----|-----------|---------|
| {함수/컴포넌트명} | {테스트 파일 경로} | High/Medium/Low |

#### 4.1.2 테스트 시나리오

**{함수/컴포넌트명} 테스트**

**Scenario 1: {시나리오 제목}**
- **Given**: {초기 상태}
- **When**: {액션}
- **Then**: {기대 결과}

**Scenario 2: {시나리오 제목}**
- **Given**: {초기 상태}
- **When**: {액션}
- **Then**: {기대 결과}

#### 4.1.3 테스트 데이터

**정상 케이스**:
```typescript
{
  {field}: {value},
  {field2}: {value2}
}
```

**엣지 케이스**:
- {케이스 1}: {데이터}
- {케이스 2}: {데이터}

**에러 케이스**:
- {케이스 1}: {데이터}
- {케이스 2}: {데이터}

### 4.2 통합 테스트

#### 4.2.1 통합 포인트

- {컴포넌트A} ↔ {컴포넌트B}: {통합 지점 설명}
- {컴포넌트C} ↔ {Store}: {통합 지점 설명}

#### 4.2.2 통합 테스트 시나리오

**Scenario: {시나리오 제목}**
1. {단계 1}
2. {단계 2}
3. {예상 결과}

### 4.3 E2E 테스트 (QA 참조용)

**User Flow**:
1. {사용자 액션 1}
2. {사용자 액션 2}
3. {예상 결과}

**검증 포인트**:
- [ ] {검증 항목 1}
- [ ] {검증 항목 2}

---

## 5. 참조 및 연결

### 5.1 Architecture 참조

- **섹션 {X.X}**: {참조 내용}
- **섹션 {Y.Y}**: {참조 내용}

### 5.2 UX Design 참조

- **섹션 {X.X}**: {참조 내용}
- **섹션 {Y.Y}**: {참조 내용}

### 5.3 관련 Story

**의존하는 Story**:
- {PROJ-XXX}: {Story 제목} - {의존 이유}

**의존받는 Story**:
- {PROJ-XXX}: {Story 제목} - {의존 이유}

### 5.4 관련 문서

- {문서명}: {경로} - {참조 이유}

---

## 6. 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | YYYY-MM-DD | Story Refiner | 초안 작성 |

---

**다음 단계**: Developer가 이 명세를 기반으로 구현 시작
```

---

## 출력 위치 및 파일 관리

### 디렉토리 구조

```
.claude/outputs/
└── {project-id}-{YYYYMMDD}/
    ├── prd.md
    ├── architecture.md
    ├── ux-design.md
    ├── epics-stories.md
    └── stories/
        ├── PROJ-007/
        │   └── story-detail.md        # Story Refiner 산출물
        ├── PROJ-008/
        │   └── story-detail.md
        └── PROJ-009/
            └── story-detail.md
```

### 파일 경로 규칙

- **Story 상세 명세**: `.claude/outputs/{project-id}-{YYYYMMDD}/stories/{story-id}/story-detail.md`
- **예시**: `.claude/outputs/PROJ-001-20250129/stories/PROJ-007/story-detail.md`

### 티켓 번호

- **Story Refiner 자체**: PROJ-005
- **각 Story**: Story ID 그대로 사용 (PROJ-007, PROJ-008 등)

---

## 주요 원칙

### 구체성 원칙
- 추상적이지 않고 구체적으로 작성
- "구현한다" 대신 "어떻게 구현하는지" 상세히 설명
- 개발자가 추가 질문 없이 바로 개발을 시작할 수 있는 수준

### 명확성 원칙
- 모호한 표현 금지
- 기술 용어는 정확하게 사용
- 예시를 통해 이해를 돕기 (코드 예시는 제외, 구현 방향만 제시)

### 완전성 원칙
- 구현에 필요한 모든 정보 포함
- 컴포넌트, 상태, 데이터 흐름, 파일 구조 모두 정의
- Architecture 및 UX Design 참조를 명확히 명시

### 실용성 원칙
- 이론보다 실제 구현에 초점
- 개발자가 실제로 사용할 수 있는 가이드 제공
- 주의사항, 팁, 흔한 실수 포함으로 개발 효율성 향상

### 중복 방지 원칙
- **PO Story 내용 중복 금지**: User Story, 설명, AC는 참조만
- **Architecture 중복 금지**: 필요한 부분만 추출하여 구현 관점에서 설명
- **UX Design 중복 금지**: 필요한 부분만 추출하여 구현 관점에서 설명

---

## 작성 체크리스트 (간략)

### 필수 항목 (⭐)
- [ ] ⭐ Story 개요 섹션 작성 (원본 Story 정보 참조)
- [ ] ⭐ 기술 스펙 완전히 정의 (컴포넌트, 상태, 데이터 흐름, 파일)
- [ ] ⭐ 구현 가이드 단계별 작성
- [ ] ⭐ 테스트 가이드 작성 (시나리오 포함)
- [ ] ⭐ Architecture 및 UX Design 참조 명시
- [ ] ⭐ 개발자가 바로 개발 시작 가능한 수준

### 권장 항목 (✓)
- [ ] ✓ 주의사항 및 팁 포함
- [ ] ✓ 흔한 실수 및 올바른 방법 제시
- [ ] ✓ 성능 최적화 포인트 명시
- [ ] ✓ 테스트 데이터 예시 제공

---

**이 템플릿은 Story Refiner 에이전트가 산출물을 생성할 때 반드시 따라야 하는 표준 형식이다.**
