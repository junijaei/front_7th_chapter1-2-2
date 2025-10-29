# Story 상세 명세: PROJ-007 - 반복 유형 선택 UI 구현

**Story ID**: PROJ-007
**Epic**: Epic-1 - 반복 일정 생성 및 표시
**버전**: 1.0.0
**작성일**: 2025-01-29
**작성자**: Story Refiner Agent
**티켓**: PROJ-007

---

## 1. Story 개요

### 1.1 원본 Story 정보

**제목**: As a 사용자, I want 일정 생성 시 반복 유형을 선택할 수 있다, so that 정기적인 일정을 효율적으로 관리할 수 있다.

**설명**:
일정 생성 폼에서 사용자가 "반복 안 함", "매일", "매주", "매월", "매년" 중 하나를 선택할 수 있는 드롭다운을 추가한다. 반복 유형을 선택하면 종료 날짜 입력 필드가 조건부로 활성화된다. PRD Feature 1 (반복 유형 선택)의 UI 부분을 구현한다.

**Acceptance Criteria**:
- [ ] 일정 생성 폼에 "반복 유형" 드롭다운이 표시된다
- [ ] 드롭다운 옵션: "반복 안 함", "매일", "매주", "매월", "매년" (5개)
- [ ] 기본값은 "반복 안 함"이다
- [ ] "반복 안 함" 이외 선택 시 종료 날짜 필드가 Slide down 애니메이션(0.2초)으로 표시된다
- [ ] "반복 안 함" 선택 시 종료 날짜 필드가 Slide up 애니메이션(0.2초)으로 숨겨진다
- [ ] 드롭다운은 키보드로 접근 가능하다 (Tab, Enter, Arrow keys)

**참조**:
- **Epic/Story 목록**: `.claude/outputs/PROJ-001-20250129/epics-stories.md` (Story PROJ-007 섹션)

### 1.2 Story 분석 요약

**비즈니스 가치**:
사용자가 일정 생성 시 반복 패턴을 설정할 수 있는 첫 번째 진입점을 제공한다. 이를 통해 정기적인 회의, 운동, 학습 일정 등을 반복 입력하지 않아도 되어 사용자 생산성이 크게 향상된다.

**기술적 복잡도**: Low to Medium

**예상 구현 시간**: 2일

**주요 도전 과제**:
- 조건부 렌더링과 애니메이션의 부드러운 전환 구현
- 접근성 (키보드 네비게이션, ARIA 레이블) 준수
- 드롭다운 상태 관리와 부모 컴포넌트와의 데이터 연동

---

## 2. 기술 스펙

### 2.1 컴포넌트 구조

#### 2.1.1 필요한 컴포넌트 목록

| 컴포넌트명 | 타입 | 경로 | 책임 | 생성/수정 |
|-----------|------|------|------|----------|
| EventForm | Feature | `src/features/calendar/components/EventForm.tsx` | 일정 생성/수정 폼의 메인 컴포넌트, 반복 유형 필드 포함 | 수정 |
| RecurrenceSelector | Feature | `src/features/calendar/components/RecurrenceSelector.tsx` | 반복 유형 선택 드롭다운 (신규 컴포넌트) | 생성 |
| Select | Common | `src/components/common/Select.tsx` | 재사용 가능한 드롭다운 컴포넌트 | 수정 (필요 시 생성) |

#### 2.1.2 컴포넌트 계층 구조

```
EventForm
├── BasicInfoSection (기존)
│   ├── Input (제목)
│   └── DatePicker (시작일, 종료일)
├── RecurrenceSelector (신규)
│   └── Select (드롭다운)
└── FormActions (기존)
    ├── Button (취소)
    └── Button (저장)
```

#### 2.1.3 주요 컴포넌트 상세

**RecurrenceSelector**

**Props 인터페이스**:
```typescript
interface RecurrenceSelectorProps {
  value: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  onChange: (value: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  disabled?: boolean;  // 폼 제출 중일 때
}
```

**State**:
- 이 컴포넌트는 상태를 직접 관리하지 않고, 부모 컴포넌트(EventForm)로부터 value와 onChange를 받는 제어 컴포넌트(Controlled Component)로 구현

**주요 기능**:
- 5가지 반복 유형 옵션 표시 ("반복 안 함", "매일", "매주", "매월", "매년")
- 사용자 선택 시 부모 컴포넌트에 onChange 콜백 호출
- 키보드 접근성 지원 (Tab, Enter, Arrow keys)
- ARIA 레이블 제공 (스크린 리더 지원)

**참조**:
- Architecture 섹션 4.2: RecurrenceSelector는 기능 컴포넌트로 분류
- UX Design 섹션 4.3.2: 드롭다운 상태 전환 (Slide down/up)

### 2.2 상태 관리

#### 2.2.1 전역 상태 (Zustand)

**사용 여부**: No

이 Story에서는 전역 상태를 사용하지 않는다. 반복 유형 선택은 일정 생성 폼의 일부이며, 폼 제출 시에만 Zustand 스토어에 저장된다.

#### 2.2.2 로컬 상태 (useState)

EventForm 컴포넌트에 다음 상태를 추가:

| State 이름 | 타입 | 초기값 | 용도 |
|-----------|------|--------|------|
| recurrenceType | 'none' \| 'daily' \| 'weekly' \| 'monthly' \| 'yearly' | 'none' | 현재 선택된 반복 유형 |
| showEndDateField | boolean | false | 종료 날짜 필드 표시 여부 (recurrenceType !== 'none'일 때 true) |

**State 정의 예시**:
```typescript
const [recurrenceType, setRecurrenceType] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('none');
const [showEndDateField, setShowEndDateField] = useState(false);
```

#### 2.2.3 상태 업데이트 로직

**recurrenceType 업데이트 시나리오**:
1. **트리거 이벤트**: 사용자가 드롭다운에서 반복 유형 선택
2. **업데이트 로직**:
   - `setRecurrenceType(선택한 값)` 호출
   - 선택한 값이 'none'이 아니면 `setShowEndDateField(true)` 호출
   - 선택한 값이 'none'이면 `setShowEndDateField(false)` 호출
3. **결과/사이드 이펙트**:
   - showEndDateField가 true로 변경되면 종료 날짜 필드가 Slide down 애니메이션으로 나타남
   - showEndDateField가 false로 변경되면 종료 날짜 필드가 Slide up 애니메이션으로 사라짐

### 2.3 데이터 흐름

#### 2.3.1 사용자 액션 → 상태 변경 흐름

```
드롭다운에서 "매주" 선택
  ↓
RecurrenceSelector의 onChange 콜백 호출
  ↓
EventForm의 handleRecurrenceChange('weekly') 실행
  ↓
setRecurrenceType('weekly')
setShowEndDateField(true)
  ↓
종료 날짜 필드가 Slide down 애니메이션(0.2초)으로 표시됨
```

**상세 흐름**:
1. 사용자가 RecurrenceSelector 드롭다운 클릭
2. 드롭다운 열림 (Slide down 0.2초)
3. 사용자가 "매주" 옵션 선택
4. RecurrenceSelector의 `onChange('weekly')` 호출
5. EventForm의 `handleRecurrenceChange` 함수 실행:
   ```typescript
   const handleRecurrenceChange = (value: RecurrenceType) => {
     setRecurrenceType(value);
     setShowEndDateField(value !== 'none');
   };
   ```
6. React가 상태 변경을 감지하고 리렌더링
7. 조건부 렌더링에 의해 종료 날짜 필드 컴포넌트가 마운트됨
8. CSS 트랜지션에 의해 Slide down 애니메이션 실행

#### 2.3.2 데이터 검증 및 에러 처리

**검증 시점**: submit (저장 버튼 클릭 시)

**검증 규칙**:
- recurrenceType: 필수는 아니지만, 유효한 5가지 값 중 하나여야 함
- 반복 유형이 'none'이 아닌 경우, 종료 날짜(endDate)가 필수로 입력되어야 함 (다음 Story PROJ-008에서 처리)

**에러 처리**:
- 이 Story에서는 반복 유형 선택 자체에 에러가 발생하지 않음 (드롭다운으로 제한)
- 종료 날짜 관련 에러는 PROJ-008에서 처리

#### 2.3.3 API 호출 (해당 시)

**API 엔드포인트**: 없음 (로컬 스토리지 사용)
이 Story에서는 API 호출이 없으며, 폼 제출 시 Zustand 스토어를 통해 LocalStorage에 저장됨.

### 2.4 파일 구조

#### 2.4.1 생성할 파일

| 파일 경로 | 목적 | 주요 내용 |
|----------|------|----------|
| `src/features/calendar/components/RecurrenceSelector.tsx` | 반복 유형 선택 드롭다운 컴포넌트 | RecurrenceSelectorProps, 5가지 옵션, Select 컴포넌트 래핑 |
| `src/features/calendar/types/recurrence.types.ts` (선택) | 반복 관련 타입 정의 | RecurrenceType, RecurrenceRule (Architecture 섹션 6.1 기반) |

#### 2.4.2 수정할 파일

| 파일 경로 | 수정 내용 | 영향 범위 |
|----------|----------|----------|
| `src/features/calendar/components/EventForm.tsx` | recurrenceType, showEndDateField 상태 추가, RecurrenceSelector 컴포넌트 추가 | 폼 렌더링 로직, 상태 관리 |
| `src/components/common/Select.tsx` (필요 시) | 키보드 접근성, ARIA 레이블 보완 | 공통 컴포넌트 (다른 드롭다운에도 영향) |

---

## 3. 구현 가이드

### 3.1 단계별 구현 순서

#### Step 1: 타입 정의 및 RecurrenceSelector 컴포넌트 생성

**목표**: 반복 유형 타입과 기본 RecurrenceSelector 컴포넌트 구조 생성

**구현 내용**:
1. `src/features/calendar/types/recurrence.types.ts` 파일 생성 (선택사항, 또는 EventForm 파일 내에 정의)
   - RecurrenceType 타입 정의:
     ```typescript
     export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
     ```
2. `src/features/calendar/components/RecurrenceSelector.tsx` 파일 생성
   - RecurrenceSelectorProps 인터페이스 정의
   - 기본 컴포넌트 구조 작성 (임시로 `<div>` 사용)
   - 5가지 옵션 배열 정의:
     ```typescript
     const RECURRENCE_OPTIONS = [
       { value: 'none', label: '반복 안 함' },
       { value: 'daily', label: '매일' },
       { value: 'weekly', label: '매주' },
       { value: 'monthly', label: '매월' },
       { value: 'yearly', label: '매년' },
     ];
     ```

**완료 조건**:
- [ ] RecurrenceType 타입 정의 완료
- [ ] RecurrenceSelector 컴포넌트 파일 생성 및 기본 구조 작성
- [ ] RECURRENCE_OPTIONS 배열 정의 완료
- [ ] TypeScript 컴파일 에러 없음

**예상 시간**: 1시간

---

#### Step 2: Select 공통 컴포넌트 확인 및 보완

**목표**: Select 공통 컴포넌트가 존재하는지 확인하고, 없으면 생성하거나 기존 컴포넌트를 보완

**구현 내용**:
1. `src/components/common/Select.tsx` 파일 존재 여부 확인
   - 존재하면: Props 인터페이스 확인 및 필요한 기능 보완
   - 존재하지 않으면: 새로 생성
2. Select 컴포넌트가 지원해야 할 기능:
   - options 배열을 받아 드롭다운 렌더링
   - value와 onChange를 통한 제어 컴포넌트 구현
   - 키보드 접근성 (Tab, Enter, Arrow keys, Esc)
   - ARIA 레이블 (`aria-label`, `aria-expanded`, `aria-activedescendant`)
   - disabled 상태 지원
3. Tailwind CSS를 사용한 스타일링:
   - 기본 상태: 회색 보더 (`border-gray-300`)
   - 포커스 상태: 파란색 보더 + 그림자 (`border-blue-500, focus:ring-2, focus:ring-blue-500`)
   - 드롭다운 열림: Slide down 애니메이션 (transition-all duration-200)

**완료 조건**:
- [ ] Select 컴포넌트 존재 또는 생성 완료
- [ ] 키보드 접근성 지원 (Tab, Enter, Arrow keys, Esc)
- [ ] ARIA 레이블 추가 완료
- [ ] Tailwind CSS 스타일링 완료
- [ ] 단위 테스트 작성 (Select 컴포넌트 독립 테스트)

**예상 시간**: 2-3시간

---

#### Step 3: RecurrenceSelector에 Select 컴포넌트 통합

**목표**: RecurrenceSelector 컴포넌트에서 Select 컴포넌트를 사용하여 드롭다운 렌더링

**구현 내용**:
1. RecurrenceSelector에서 Select 컴포넌트 import
2. Select 컴포넌트에 RECURRENCE_OPTIONS, value, onChange Props 전달
3. ARIA 레이블 추가:
   ```typescript
   <Select
     options={RECURRENCE_OPTIONS}
     value={value}
     onChange={onChange}
     aria-label="반복 유형 선택"
     disabled={disabled}
   />
   ```
4. 스타일링 및 레이아웃 조정

**완료 조건**:
- [ ] Select 컴포넌트가 RecurrenceSelector에서 정상 렌더링됨
- [ ] RECURRENCE_OPTIONS가 드롭다운에 표시됨
- [ ] onChange 콜백이 정상 호출됨
- [ ] ARIA 레이블 확인 (스크린 리더 테스트)

**예상 시간**: 1시간

---

#### Step 4: EventForm에 RecurrenceSelector 통합 및 상태 관리

**목표**: EventForm 컴포넌트에 RecurrenceSelector를 추가하고 상태 관리 로직 구현

**구현 내용**:
1. EventForm에 상태 추가:
   ```typescript
   const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
   const [showEndDateField, setShowEndDateField] = useState(false);
   ```
2. handleRecurrenceChange 함수 구현:
   ```typescript
   const handleRecurrenceChange = (value: RecurrenceType) => {
     setRecurrenceType(value);
     setShowEndDateField(value !== 'none');
   };
   ```
3. EventForm JSX에 RecurrenceSelector 추가 (BasicInfoSection 아래):
   ```typescript
   <RecurrenceSelector
     value={recurrenceType}
     onChange={handleRecurrenceChange}
   />
   ```
4. 폼 제출 시 recurrenceType을 Event 객체에 포함:
   ```typescript
   const event: Event = {
     // ...기존 필드
     isRecurring: recurrenceType !== 'none',
     recurrence: recurrenceType !== 'none' ? {
       type: recurrenceType,
       endDate: endDate, // PROJ-008에서 입력받음
       exceptions: [],
     } : undefined,
   };
   ```

**완료 조건**:
- [ ] EventForm에 RecurrenceSelector가 정상 렌더링됨
- [ ] 드롭다운 선택 시 recurrenceType 상태가 업데이트됨
- [ ] showEndDateField 상태가 올바르게 변경됨
- [ ] 폼 제출 시 Event 객체에 recurrenceType이 포함됨

**예상 시간**: 2시간

---

#### Step 5: 조건부 렌더링 및 애니메이션 구현

**목표**: 반복 유형 선택 시 종료 날짜 필드가 부드럽게 나타나고 사라지는 애니메이션 구현

**구현 내용**:
1. EventForm JSX에서 종료 날짜 필드를 조건부 렌더링:
   ```typescript
   {showEndDateField && (
     <div className="overflow-hidden transition-all duration-200 ease-in-out">
       <DatePicker
         label="종료 날짜"
         value={endDate}
         onChange={setEndDate}
       />
     </div>
   )}
   ```
2. CSS 트랜지션을 사용하여 Slide down/up 애니메이션 구현:
   - Tailwind CSS의 `transition-all`, `duration-200`, `ease-in-out` 활용
   - 또는 Framer Motion 라이브러리 사용 (선택사항)
3. 애니메이션 테스트:
   - "반복 안 함" → "매주" 선택 시 Slide down 확인
   - "매주" → "반복 안 함" 선택 시 Slide up 확인
   - 애니메이션 시간이 0.2초인지 확인

**완료 조건**:
- [ ] showEndDateField가 true일 때 종료 날짜 필드가 Slide down으로 나타남
- [ ] showEndDateField가 false일 때 종료 날짜 필드가 Slide up으로 사라짐
- [ ] 애니메이션 시간이 0.2초임
- [ ] 애니메이션이 부드럽게 전환됨 (끊김 없음)

**예상 시간**: 2시간

---

#### Step 6: 접근성 보완 및 테스트

**목표**: 키보드 네비게이션, ARIA 레이블, 스크린 리더 지원 등 접근성 요구사항 충족

**구현 내용**:
1. 키보드 네비게이션 테스트:
   - Tab 키로 RecurrenceSelector로 포커스 이동
   - Enter 키로 드롭다운 열기/선택
   - Arrow keys로 옵션 간 이동
   - Esc 키로 드롭다운 닫기
2. ARIA 레이블 추가 및 확인:
   - RecurrenceSelector: `aria-label="반복 유형 선택"`
   - Select: `aria-expanded`, `aria-activedescendant`
   - 각 옵션: `role="option"`
3. 포커스 표시 확인:
   - Tailwind CSS의 `focus:outline-2`, `focus:outline-blue-500` 적용
4. 스크린 리더 테스트 (macOS VoiceOver 또는 NVDA):
   - "반복 유형 선택" 읽힘 확인
   - 선택된 옵션 읽힘 확인

**완료 조건**:
- [ ] Tab, Enter, Arrow keys, Esc 키보드 네비게이션 정상 작동
- [ ] ARIA 레이블이 올바르게 설정됨
- [ ] 포커스 표시가 명확히 보임
- [ ] 스크린 리더가 컴포넌트를 올바르게 읽음

**예상 시간**: 2시간

---

### 3.2 주요 구현 포인트

#### 3.2.1 조건부 렌더링과 애니메이션 동시 구현

**구현 방법**:
조건부 렌더링(`{showEndDateField && ...}`)과 CSS 트랜지션을 조합하여 부드러운 애니메이션을 구현한다. 단순히 `display: none`을 사용하면 애니메이션이 작동하지 않으므로, `max-height`, `opacity`, `transform` 등의 속성을 조합한다.

**옵션 1: Tailwind CSS 사용**
```typescript
<div
  className={`
    overflow-hidden transition-all duration-200 ease-in-out
    ${showEndDateField ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
  `}
>
  <DatePicker ... />
</div>
```

**옵션 2: Framer Motion 사용 (권장)**
```typescript
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {showEndDateField && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <DatePicker ... />
    </motion.div>
  )}
</AnimatePresence>
```

**사용할 라이브러리/함수**:
- Tailwind CSS: `transition-all`, `duration-200`, `max-h-*`, `opacity-*`
- 또는 Framer Motion: `AnimatePresence`, `motion.div`

**참조**:
- UX Design 섹션 4.3.4: 조건부 필드 애니메이션 (Slide down 0.2초)

#### 3.2.2 Select 컴포넌트 키보드 접근성 구현

**구현 방법**:
HTML의 네이티브 `<select>` 요소를 사용하면 키보드 접근성이 자동으로 지원되지만, 스타일링 제한이 있다. 커스텀 드롭다운을 구현하는 경우 키보드 이벤트를 직접 핸들링해야 한다.

**옵션 1: 네이티브 `<select>` 사용 (권장 - 빠르고 접근성 보장)**
```typescript
<select
  value={value}
  onChange={(e) => onChange(e.target.value as RecurrenceType)}
  aria-label="반복 유형 선택"
  className="..."
>
  {RECURRENCE_OPTIONS.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
```

**옵션 2: 커스텀 드롭다운 (스타일링 자유도 높음)**
- `onKeyDown` 핸들러 추가하여 Enter, Arrow keys, Esc 처리
- `role="listbox"`, `role="option"` 추가
- `aria-expanded`, `aria-activedescendant` 관리

**사용할 라이브러리/함수**:
- 네이티브 `<select>`: HTML 표준
- 또는 Headless UI의 `Listbox`: 접근성이 내장된 커스텀 드롭다운
- 또는 Radix UI의 `Select`: 접근성 및 스타일링 지원

**참조**:
- UX Design 섹션 5.1: 키보드 네비게이션 (Tab, Enter, Arrow keys, Esc)

#### 3.2.3 폼 제출 시 Event 객체 구성

**구현 방법**:
폼 제출 시 recurrenceType 상태를 기반으로 Event 객체의 `isRecurring`과 `recurrence` 필드를 설정한다. `recurrenceType`이 'none'이면 `isRecurring: false`, 그 외에는 `isRecurring: true`로 설정하고 `recurrence` 객체를 포함한다.

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const event: Event = {
    id: generateId(),
    title,
    startDate,
    endDate: recurrenceType !== 'none' ? recurrenceEndDate : startDate,
    isRecurring: recurrenceType !== 'none',
    recurrence: recurrenceType !== 'none' ? {
      type: recurrenceType,
      endDate: recurrenceEndDate, // PROJ-008에서 입력
      exceptions: [],
    } : undefined,
  };

  // Zustand 스토어에 저장
  addEvent(event);
};
```

**사용할 라이브러리/함수**:
- Zustand의 `addEvent` 액션
- `generateId` 유틸 함수 (UUID 또는 nanoid)

**참조**:
- Architecture 섹션 6.1: Event 인터페이스 및 RecurrenceRule 구조

### 3.3 주의사항 및 팁

**주의사항**:
- ⚠️ **조건부 렌더링 시 React key 사용**: 종료 날짜 필드가 마운트/언마운트될 때 상태가 초기화되지 않도록 주의 (필요 시 key 사용)
- ⚠️ **애니메이션과 레이아웃 시프트**: Slide down 애니메이션 시 아래 요소들이 밀려나는 것이 자연스러우므로, `overflow-hidden`을 적절히 사용
- ⚠️ **접근성 테스트 필수**: 키보드와 스크린 리더로 직접 테스트하지 않으면 접근성 문제를 놓칠 수 있음

**구현 팁**:
- 💡 **네이티브 `<select>` 우선 고려**: 커스텀 드롭다운보다 접근성과 구현 속도가 우수. 스타일링이 중요하면 Headless UI나 Radix UI 라이브러리 사용
- 💡 **Framer Motion 활용**: CSS 트랜지션보다 Framer Motion이 조건부 렌더링과 애니메이션 조합이 쉬움
- 💡 **TypeScript 타입 가드**: recurrenceType !== 'none' 조건을 자주 사용하므로, 타입 가드 함수로 분리하면 코드 가독성 향상:
  ```typescript
  const isRecurring = (type: RecurrenceType): boolean => type !== 'none';
  ```

**흔한 실수**:
- ❌ **조건부 렌더링에서 `display: none` 사용**: 애니메이션이 작동하지 않음
  - ✅ **`max-height`와 `opacity` 조합 사용** 또는 Framer Motion의 `AnimatePresence`
- ❌ **ARIA 레이블 누락**: 스크린 리더 사용자가 컴포넌트 용도를 알 수 없음
  - ✅ **모든 인터랙티브 요소에 `aria-label` 추가**
- ❌ **키보드 네비게이션 테스트 생략**: 마우스로만 테스트하면 키보드 접근성 문제를 놓침
  - ✅ **Tab, Enter, Arrow keys, Esc로 직접 테스트**

**성능 최적화**:
- RecurrenceSelector 컴포넌트는 React.memo로 래핑하여 불필요한 리렌더링 방지:
  ```typescript
  export const RecurrenceSelector = React.memo<RecurrenceSelectorProps>(({ value, onChange }) => {
    // ...
  });
  ```
- RECURRENCE_OPTIONS 배열을 컴포넌트 외부에 정의하여 매 렌더링마다 재생성 방지

---

## 4. 테스트 가이드

### 4.1 단위 테스트

#### 4.1.1 테스트 대상

| 대상 | 테스트 파일 | 우선순위 |
|-----|-----------|---------|
| RecurrenceSelector | `src/features/calendar/components/RecurrenceSelector.test.tsx` | High |
| Select (공통 컴포넌트) | `src/components/common/Select.test.tsx` | Medium |
| EventForm (recurrenceType 상태 관리) | `src/features/calendar/components/EventForm.test.tsx` | High |

#### 4.1.2 테스트 시나리오

**RecurrenceSelector 테스트**

**Scenario 1: 기본 렌더링**
- **Given**: RecurrenceSelector가 마운트됨
- **When**: 컴포넌트가 렌더링됨
- **Then**:
  - 드롭다운이 표시됨
  - 기본값이 "반복 안 함"임
  - 5개 옵션이 모두 렌더링됨

**Scenario 2: 옵션 선택 시 onChange 호출**
- **Given**: RecurrenceSelector가 렌더링됨
- **When**: 사용자가 "매주" 옵션을 선택함
- **Then**:
  - onChange 콜백이 'weekly' 인자와 함께 호출됨
  - 선택된 값이 "매주"로 표시됨

**Scenario 3: 키보드 네비게이션**
- **Given**: RecurrenceSelector가 포커스를 받음
- **When**: Enter 키를 누르고, Arrow Down 키를 누르고, Enter 키를 다시 누름
- **Then**:
  - 드롭다운이 열림
  - 다음 옵션으로 포커스 이동
  - 해당 옵션이 선택되고 onChange 호출됨

**Scenario 4: disabled 상태**
- **Given**: RecurrenceSelector가 disabled=true로 렌더링됨
- **When**: 사용자가 드롭다운을 클릭하려고 함
- **Then**:
  - 드롭다운이 열리지 않음
  - 커서가 `not-allowed`로 표시됨

---

**EventForm (조건부 렌더링) 테스트**

**Scenario 1: 반복 유형 선택 시 종료 날짜 필드 표시**
- **Given**: EventForm이 렌더링되고 recurrenceType이 'none'임
- **When**: 사용자가 "매일"을 선택함
- **Then**:
  - showEndDateField가 true로 변경됨
  - 종료 날짜 필드가 DOM에 나타남

**Scenario 2: "반복 안 함" 선택 시 종료 날짜 필드 숨김**
- **Given**: recurrenceType이 'weekly'이고 종료 날짜 필드가 표시됨
- **When**: 사용자가 "반복 안 함"을 선택함
- **Then**:
  - showEndDateField가 false로 변경됨
  - 종료 날짜 필드가 DOM에서 사라짐

**Scenario 3: 폼 제출 시 Event 객체에 recurrence 포함**
- **Given**: recurrenceType이 'monthly'이고 종료 날짜가 '2025-12-31'임
- **When**: "저장" 버튼을 클릭함
- **Then**:
  - addEvent가 호출됨
  - Event 객체의 isRecurring이 true임
  - Event 객체의 recurrence.type이 'monthly'임
  - Event 객체의 recurrence.endDate가 '2025-12-31'임

#### 4.1.3 테스트 데이터

**정상 케이스**:
```typescript
{
  recurrenceType: 'weekly',
  title: '주간 회의',
  startDate: '2025-01-29',
  endDate: '2025-12-31',
}
```

**엣지 케이스**:
- 케이스 1: recurrenceType이 'none'일 때 recurrence 필드가 undefined
- 케이스 2: disabled 상태에서 드롭다운 클릭 불가
- 케이스 3: 빠른 반복 클릭 (debounce 테스트는 불필요, 즉각 반응)

**에러 케이스**:
- 이 Story에서는 반복 유형 선택 자체에 에러가 없음 (드롭다운으로 제한)
- 종료 날짜 관련 에러는 PROJ-008에서 테스트

### 4.2 통합 테스트

#### 4.2.1 통합 포인트

- RecurrenceSelector ↔ EventForm: RecurrenceSelector의 onChange가 EventForm의 상태를 업데이트
- EventForm ↔ Zustand Store: 폼 제출 시 addEvent 액션 호출

#### 4.2.2 통합 테스트 시나리오

**Scenario: 반복 일정 생성 전체 플로우**
1. EventForm 모달을 연다
2. 제목에 "주간 회의" 입력
3. 시작일/종료일 선택
4. 반복 유형에서 "매주" 선택
5. 종료 날짜 필드가 나타나는지 확인
6. 종료 날짜 선택 (PROJ-008에서 구현)
7. "저장" 버튼 클릭
8. Zustand 스토어의 events 배열에 새 일정이 추가되는지 확인
9. Event 객체의 isRecurring이 true인지 확인
10. Event 객체의 recurrence.type이 'weekly'인지 확인

### 4.3 E2E 테스트 (QA 참조용)

**User Flow**:
1. 사용자가 "일정 추가" 버튼 클릭
2. 일정 생성 폼 모달이 열림
3. 제목 입력: "주간 회의"
4. 시작일/종료일 선택
5. "반복 유형" 드롭다운 클릭
6. "매주" 옵션 선택
7. 종료 날짜 필드가 Slide down 애니메이션으로 나타남 (0.2초)
8. 종료 날짜 입력 (PROJ-008에서 구현)
9. "저장" 버튼 클릭
10. 모달이 닫히고 Toast 메시지 "일정이 생성되었습니다." 표시
11. 캘린더에 반복 일정이 표시됨 (반복 아이콘 포함 - PROJ-010에서 구현)

**검증 포인트**:
- [ ] 드롭다운이 5개 옵션을 표시한다
- [ ] "반복 안 함"이 기본 선택되어 있다
- [ ] 반복 유형 선택 시 종료 날짜 필드가 Slide down 애니메이션으로 나타난다
- [ ] "반복 안 함" 선택 시 종료 날짜 필드가 Slide up 애니메이션으로 사라진다
- [ ] Tab 키로 드롭다운에 포커스 이동 가능하다
- [ ] Enter 키로 드롭다운을 열 수 있다
- [ ] Arrow keys로 옵션 간 이동 가능하다
- [ ] Esc 키로 드롭다운을 닫을 수 있다
- [ ] 스크린 리더가 "반복 유형 선택"을 읽는다

---

## 5. 참조 및 연결

### 5.1 Architecture 참조

- **섹션 4.1**: RecurrenceSelector는 기능 컴포넌트로 분류, `src/features/calendar/components/` 경로
- **섹션 5.1**: EventForm의 로컬 상태로 recurrenceType 관리 (Zustand 스토어는 폼 제출 시에만 사용)
- **섹션 6.1**: Event 인터페이스의 `isRecurring`, `recurrence` 필드 구조
- **섹션 7**: 디렉토리 구조 및 파일 명명 규칙 (PascalCase for components)

### 5.2 UX Design 참조

- **섹션 2.2.2**: 일정 생성/수정 플로우 (반복 유형 선택 → 종료 날짜 필드 활성화)
- **섹션 3.2.2**: 일정 생성/수정 폼 모달의 화면 구성 (반복 유형 드롭다운 위치)
- **섹션 4.1.2**: 보조 액션 - 반복 유형 변경 시 Slide down/up 애니메이션 (0.2초)
- **섹션 4.3.2**: 드롭다운 상태 전환 (열림/닫힘 애니메이션 0.2초)
- **섹션 4.3.4**: 조건부 필드 (종료 날짜) Slide down/up 애니메이션
- **섹션 5.1**: 키보드 네비게이션 (Tab, Enter, Arrow keys, Esc)
- **섹션 5.2**: ARIA 레이블 및 스크린 리더 지원

### 5.3 관련 Story

**의존하는 Story**: 없음
PROJ-007은 Epic-1의 첫 번째 Story로, 다른 Story에 의존하지 않는다.

**의존받는 Story**:
- **PROJ-008**: 반복 종료 조건 UI 구현 - PROJ-007에서 구현한 조건부 렌더링을 활용하여 종료 날짜 필드를 표시
- **PROJ-009**: 반복 일정 생성 로직 구현 - PROJ-007에서 수집한 recurrenceType을 기반으로 반복 일정 생성

### 5.4 관련 문서

- **PRD**: `.claude/outputs/PROJ-001-20250129/prd.md` - Feature 1 (반복 유형 선택) 참조
- **Architecture**: `.claude/outputs/PROJ-001-20250129/architecture.md` - 섹션 4, 5, 6, 7 참조
- **UX Design**: `.claude/outputs/PROJ-001-20250129/ux-design.md` - 섹션 2, 3, 4, 5 참조
- **Epic/Story 목록**: `.claude/outputs/PROJ-001-20250129/epics-stories.md` - PROJ-007 섹션

---

## 6. 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2025-01-29 | Story Refiner | 초안 작성 |

---

**다음 단계**: Developer가 이 명세를 기반으로 구현 시작
