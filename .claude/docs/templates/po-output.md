# Product Owner (PO) Agent Output Template

**버전:** 1.0.0
**생성일:** 2025-01-29
**목적:** PO 에이전트의 산출물 형식 및 구조 정의

---

## 산출물 개요

PO 에이전트는 **Epic/Story 목록 문서**를 주요 산출물로 생성한다.

### 파일 정보
- **파일명**: `epics-stories.md`
- **경로**: `.claude/outputs/{project-id}-{YYYYMMDD}/epics-stories.md`
- **예시**: `.claude/outputs/PROJ-001-20250129/epics-stories.md`
- **티켓**: PROJ-004
- **목적**: 개발 가능한 단위의 Epic과 Story로 요구사항 분할

---

## Epic/Story 목록 문서 템플릿

```markdown
# Epic & Story Breakdown

**프로젝트명**: [프로젝트 이름]
**버전**: 1.0.0
**작성일**: YYYY-MM-DD
**작성자**: Product Owner (PO Agent)
**프로젝트 ID**: [project-id]-[YYYYMMDD]
**티켓**: PROJ-004

---

## 1. 개요

### 1.1 문서 목적
이 문서는 [프로젝트명]의 요구사항을 Epic과 Story로 분할하여 개발 가능한 단위로 정의한다.

### 1.2 참조 문서
- **PRD**: `.claude/outputs/[project-id]-[YYYYMMDD]/prd.md`
- **Architecture**: `.claude/outputs/[project-id]-[YYYYMMDD]/architecture.md`
- **UX Design**: `.claude/outputs/[project-id]-[YYYYMMDD]/ux-design.md`

### 1.3 Story 작성 원칙
- **독립성**: 각 Story는 독립적으로 개발 및 테스트 가능
- **크기**: 1-3일 내 완료 가능한 크기
- **수직 슬라이싱**: UI → 로직 → 데이터까지 포함
- **명확성**: Acceptance Criteria가 명확하고 측정 가능

---

## 2. PRD 요약

**참고**: PRD에 정의된 내용을 참조만 하고 중복 작성하지 않는다.

**주요 기능**: [PRD 섹션 X 참조 - 기능 목록만 나열]
- 기능 1
- 기능 2
- 기능 3

**제약사항**: [PRD 섹션 X 참조 - Epic/Story 분할에 영향을 미치는 것만]
- 제약사항 1
- 제약사항 2

---

## 3. Epic 목록

### 3.1 Epic 개요

| Epic ID | Epic 이름 | 목표 | 우선순위 | Story 개수 | 의존성 |
|---------|----------|------|----------|-----------|--------|
| Epic-1 | [Epic 이름] | [목표] | High/Medium/Low | N개 | 없음 또는 Epic-X |
| Epic-2 | [Epic 이름] | [목표] | High/Medium/Low | N개 | 없음 또는 Epic-X |

### 3.2 Epic 상세

#### Epic-1: [Epic 이름]

**목표**: [이 Epic을 통해 달성하고자 하는 목표]

**범위**:
- [포함되는 기능 1]
- [포함되는 기능 2]
- [포함되는 기능 3]

**비즈니스 가치**: [사용자/비즈니스에 제공하는 가치]

**우선순위**: High / Medium / Low

**의존성**: 없음 또는 [Epic-X에 의존]

**포함된 Story**:
- PROJ-007: [Story 제목]
- PROJ-008: [Story 제목]
- PROJ-009: [Story 제목]

**완료 조건**:
- [ ] 모든 포함된 Story가 완료됨
- [ ] Epic 목표가 달성됨
- [ ] 통합 테스트 통과

---

#### Epic-2: [Epic 이름]

[위와 동일한 형식]

---

## 4. Story 목록

### 4.1 Story 개요

| Story ID | Story 제목 | Epic | 우선순위 | 의존성 | 상태 |
|----------|-----------|------|----------|--------|------|
| PROJ-007 | [제목] | Epic-1 | High/Medium/Low | 없음 또는 PROJ-XXX | Pending |
| PROJ-008 | [제목] | Epic-1 | High/Medium/Low | 없음 또는 PROJ-XXX | Pending |
| PROJ-009 | [제목] | Epic-2 | High/Medium/Low | 없음 또는 PROJ-XXX | Pending |

---

## 5. Story 상세 명세

### Story: PROJ-007 - [Story 제목]

**Epic**: Epic-1 - [Epic 이름]

**제목**: As a [사용자 역할], I want [기능/목표], so that [목적/이유].

**설명**:
[Story의 배경 및 상세 내용을 기술]
[사용자가 무엇을 하려고 하는지, 왜 필요한지 설명]
[기술적 맥락이나 제약사항 포함]

**Acceptance Criteria**:
- [ ] [완료 조건 1 - 구체적이고 측정 가능하게]
- [ ] [완료 조건 2 - 테스트 가능하게]
- [ ] [완료 조건 3 - 사용자 관점으로]

**Given-When-Then** (선택사항):
- **Given** [초기 상태/전제 조건]
- **When** [사용자 액션]
- **Then** [기대 결과]

**기술적 고려사항** (Architecture 기반):
- [구현 시 고려해야 할 기술적 사항 1]
- [구현 시 고려해야 할 기술적 사항 2]
- [참조: Architecture 섹션 X.X]

**UX 요구사항** (UX Design 기반):
- [화면 구성 요구사항]
- [인터랙션 패턴]
- [접근성 요구사항]
- [참조: UX Design 섹션 X.X]

**의존성**:
- 없음 또는 [PROJ-XXX에 의존 - 이유 설명]

**우선순위**: High / Medium / Low

**예상 공수**: [1-3일]

**완료 조건**:
- [ ] 모든 Acceptance Criteria 충족
- [ ] 코드 리뷰 완료
- [ ] 단위 테스트 작성 및 통과
- [ ] QA 테스트 통과

---

### Story: PROJ-008 - [Story 제목]

[위와 동일한 형식]

---

### Story: PROJ-009 - [Story 제목]

[위와 동일한 형식]

---

## 6. Story 우선순위 및 실행 순서

### 6.1 우선순위별 분류

**High Priority** (즉시 시작):
- PROJ-007: [제목]
- PROJ-008: [제목]

**Medium Priority** (High 완료 후):
- PROJ-009: [제목]
- PROJ-010: [제목]

**Low Priority** (여유 있을 때):
- PROJ-011: [제목]

### 6.2 의존성 다이어그램

```
PROJ-007 (기반 Story)
    ↓
PROJ-008 (PROJ-007에 의존)
    ↓
PROJ-009 (PROJ-008에 의존)

PROJ-010 (독립적)

PROJ-011 (PROJ-009 + PROJ-010에 의존)
    ↓
PROJ-012 (최종 통합)
```

### 6.3 권장 실행 순서

**Phase 1** (Sprint 1):
1. PROJ-007 (High, 의존성 없음)
2. PROJ-010 (High, 독립적)

**Phase 2** (Sprint 2):
3. PROJ-008 (High, PROJ-007 완료 후)
4. PROJ-009 (Medium, PROJ-008 완료 후)

**Phase 3** (Sprint 3):
5. PROJ-011 (Medium, PROJ-009 + PROJ-010 완료 후)
6. PROJ-012 (Low, 최종 통합)

---

## 7. 기술적 제약사항 요약

**Architecture 기반**:
- [기술 스택 제약]
- [성능 요구사항]
- [데이터 모델 제약]

**UX Design 기반**:
- [접근성 요구사항]
- [반응형 지원 범위]
- [인터랙션 제약]

---

## 8. Story 예시 (참고용)

### 실제 프로젝트 Story 예시

#### Story: PROJ-007 - 반복 유형 선택 UI 구현

**Epic**: Epic-1 - 반복 일정 생성 기능

**제목**: As a 사용자, I want 일정 생성 시 반복 유형을 선택할 수 있다, so that 정기적인 일정을 효율적으로 관리할 수 있다.

**설명**:
일정 생성 폼에서 사용자가 "반복 안 함", "매일", "매주", "매월", "매년" 중 하나를 선택할 수 있는 드롭다운을 추가한다.
반복 유형을 선택하면 종료 날짜 입력 필드가 활성화된다.
PRD Feature 1 (반복 유형 선택)을 구현한다.

**Acceptance Criteria**:
- [ ] 일정 생성 폼에 "반복 유형" 드롭다운이 표시된다
- [ ] 드롭다운 옵션: "반복 안 함", "매일", "매주", "매월", "매년"
- [ ] 기본값은 "반복 안 함"이다
- [ ] "반복 안 함" 이외 선택 시 종료 날짜 필드가 Slide down 애니메이션으로 표시된다
- [ ] "반복 안 함" 선택 시 종료 날짜 필드가 숨겨진다
- [ ] 종료 날짜 기본값은 2025-12-31이다

**기술적 고려사항**:
- EventForm 컴포넌트에 recurrenceType 상태 추가 (useState)
- 조건부 렌더링으로 종료 날짜 필드 표시/숨김 처리
- Architecture의 Event 인터페이스에 isRecurring, recurrence 필드 활용
- 상태 관리: Zustand 스토어에 반복 정보 저장

**UX 요구사항**:
- Slide down 애니메이션 시간: 0.2초
- 종료 날짜 필드는 Date Picker 사용
- UX Design 섹션 4.3.4 (조건부 필드) 참조
- 드롭다운 스타일: UX Design 섹션 4.3.2 참조

**의존성**: 없음

**우선순위**: High

**예상 공수**: 2일

**완료 조건**:
- [ ] 모든 Acceptance Criteria 충족
- [ ] 코드 리뷰 완료
- [ ] 단위 테스트 작성 (드롭다운 선택, 조건부 렌더링)
- [ ] QA 테스트 통과

---

## 9. 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | YYYY-MM-DD | PO Agent | 초안 작성 |

---

**다음 단계**: Story Refiner에게 전달하여 각 Story의 구체적인 구현 스펙 작성
```

---

## 출력 위치 및 파일 관리

### 파일 경로
- **Epic/Story 목록 문서**: `.claude/outputs/{project-id}-{YYYYMMDD}/epics-stories.md`
- **예시**: `.claude/outputs/PROJ-001-20250129/epics-stories.md`

### Story별 산출물 (Story Refiner가 생성)
- **Story 상세 명세**: `.claude/outputs/{project-id}-{YYYYMMDD}/stories/{story-id}/story-detail.md`
- **예시**: `.claude/outputs/PROJ-001-20250129/stories/PROJ-007/story-detail.md`

### 티켓 번호 할당 규칙
- **PROJ-004**: PO (Epic/Story 목록)
- **PROJ-005**: Story Refiner (향후)
- **PROJ-007~**: 각 Story의 티켓 번호 (순차적 할당)

---

## 주요 원칙

### Epic 작성 원칙
1. **비즈니스 가치 중심**: Epic은 사용자에게 제공하는 가치를 명확히 표현
2. **독립성**: 각 Epic은 독립적인 비즈니스 가치를 제공
3. **적절한 크기**: Epic은 여러 Story로 구성되며, 1-2 Sprint 내 완료 가능

### Story 작성 원칙
1. **User Story 형식**: "As a [역할], I want [기능], so that [목적]"
2. **INVEST 원칙**:
   - **I**ndependent: 독립적
   - **N**egotiable: 협상 가능
   - **V**aluable: 가치 제공
   - **E**stimable: 추정 가능
   - **S**mall: 작은 크기 (1-3일)
   - **T**estable: 테스트 가능

3. **Acceptance Criteria**:
   - 구체적이고 측정 가능
   - 테스트 가능
   - 사용자 관점
   - Given-When-Then 형식 또는 체크리스트

### PRD/Architecture/UX Design 중복 방지
- **PRD**: 기능 목록만 참조, 상세 내용 중복 작성 금지
- **Architecture**: 기술적 제약사항만 추출, 전체 아키텍처 중복 작성 금지
- **UX Design**: UX 요구사항만 추출, 전체 UX 플로우 중복 작성 금지

---

**이 템플릿은 PO 에이전트가 산출물을 생성할 때 반드시 따라야 하는 표준 형식이다.**
