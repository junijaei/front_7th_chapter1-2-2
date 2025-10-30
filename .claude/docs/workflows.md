# Frontend Agent Workflow

본 문서는 프론트엔드 프로젝트를 위한 에이전트 간 워크플로우를 정의한다.
모든 에이전트는 **Orchestrator**의 조율 하에 동작하며, Orchestrator는 TDD 사이클이 성공적으로 완료될 때까지 각 에이전트를 적절하게 호출하고 관리한다.
워크플로우는 선형이 아닌 병렬적으로 동작할 수 있으며, 모든 산출물은 명시적으로 연결된다.

---

## 1. Agent Overview

| 순서 | 에이전트 | 주요 역할 | 입력 | 산출물 |
| ---- | -------- | -------- | ---- | ------ |
| 0 | **Orchestrator** | TDD 워크플로우 자동 조율 및 실행 | 사용자 요구사항 | 완성된 기능 (모든 테스트 통과) |
| 1 | **Product Manager (PM)** | 프로젝트 전반 관리 및 PRD 작성 | PRD 초안 | 최종 PRD |
| 2 | **Test Designer** | 테스트 시나리오 설계 | PRD | 테스트 시나리오 문서 |
| 3 | **Test Writer** | 테스트 코드 작성 | 테스트 시나리오 | 실패하는 테스트 코드 |
| 4 | **Implementer** | 기능 구현 및 코드 작성 | PRD, 테스트 코드 | 테스트 통과 코드 |
| 5 | **QA** | 통합 테스트 및 검증 | 코드, PRD | 테스트 리포트 |
| 6 | **Refactorer** | 코드 품질 개선 및 리팩토링 | 구현 코드, 테스트 코드 | 리팩토링된 코드 |
| 7 | **Doc Keeper** | 산출물 인덱싱 및 문서화 | 모든 문서 | 문서 인덱스, 레포트 |

---

## 2. Workflow Overview

### 0. **Orchestrator (TDD 워크플로우 조율자)**
   - **역할**: 요구사항을 받아 TDD 사이클이 완전히 완료될 때까지 모든 에이전트를 자동으로 조율
   - **책임**:
     - 사용자 요구사항 분석 및 프로젝트 초기화
     - PM → Test Designer → Test Writer → Implementer → QA → Refactorer 순차 실행
     - 각 단계의 산출물 검증 및 다음 단계 실행 여부 판단
     - 테스트 실패 시 적절한 단계로 회귀 (TDD Red-Green-Refactor 보장)
     - 모든 테스트 통과 확인 및 최종 완료 판정
   - **종료 조건**: 모든 테스트가 통과하고 QA 검증이 완료될 때까지 반복
   - **산출물**: 완성된 기능 (테스트 + 구현 코드 + 문서)

### 1. **PM**
   - 프로젝트 시작점으로 PRD를 작성하고 요구사항을 정의.
   - 모든 기능 요구사항과 제약사항을 명확히 문서화.
   - Orchestrator의 요청에 따라 실행.

### 2. **TDD 사이클 (Test Designer → Test Writer → Implementer)**
   - **Test Designer**: PRD 기반 테스트 시나리오 설계
     - Given-When-Then 형식 테스트 케이스 작성
     - 단위/통합 테스트 범위 정의
     - 테스트 데이터 및 Mocking 전략 수립
   - **Test Writer**: 실패하는 테스트 코드 작성 (Red 단계)
     - 테스트 시나리오를 실행 가능한 테스트 코드로 변환
     - 테스트 실행 시 실패 확인 (구현 전)
   - **Implementer**: 테스트를 통과하는 코드 구현 (Green 단계)
     - 테스트를 통과시키는 코드 작성
     - 모든 테스트 통과 확인
   - 검증 실패 시 Test Writer 또는 Implementer 단계로 회귀

3. **QA (통합 테스트 및 검증)**
   - E2E 테스트 수행
   - 크로스 브라우저 테스트
   - 접근성 및 성능 테스트
   - 검증 실패 시 해당 단계로 회귀

4. **Refactorer (코드 품질 개선)**
   - 중복 코드 제거
   - 코드 가독성 및 유지보수성 개선
   - 디자인 패턴 적용
   - 성능 최적화
   - 모든 테스트가 여전히 통과하는지 확인

5. **Doc Keeper**
   - 모든 산출물을 인덱싱 및 아카이빙.
   - 문서 갱신 및 종합 리포트 생성.

---

## 3. Data Flow Summary

### 3.1 Orchestrator 중심 흐름

```
[사용자 요구사항]
        ↓
┌──────────────────────────────────────────────────────┐
│                    Orchestrator                      │
│  (TDD 사이클 완료까지 모든 에이전트 조율 및 반복)     │
└──────────────────────────────────────────────────────┘
        ↓
    ┌───┴───┐
    │   PM  │ [PRD 작성]
    └───┬───┘
        ↓
    ┌───────────┐
    │Test Designer│ [테스트 시나리오 설계]
    └─────┬─────┘
          ↓
    ┌───────────┐
    │Test Writer│ [실패하는 테스트 작성 - RED]
    └─────┬─────┘
          ↓
    ┌────────────┐
    │Implementer │ [테스트 통과 코드 작성 - GREEN]
    └─────┬──────┘
          ↓
      ┌───┴───┐
      │   QA  │ [통합 검증]
      └───┬───┘
          ↓
    ┌─────┴─────┐
    │           │
    PASS       FAIL
    │           │
    ↓           └──→ [회귀: 적절한 단계로]
┌──────────┐
│Refactorer│ [코드 품질 개선 - REFACTOR]
└────┬─────┘
     ↓
 [QA 재검증]
     ↓
  [완료]
```

### 3.2 상세 흐름 (Orchestrator 관점)

```
Orchestrator 시작
  ↓
1. PM 실행 → PRD 생성
  ↓ [PRD 검증]
2. Test Designer 실행 → 테스트 시나리오 생성
  ↓ [시나리오 검증]
3. Test Writer 실행 → 실패하는 테스트 생성 (RED)
  ↓ [테스트 실행: 실패 확인]
4. Implementer 실행 → 코드 구현 (GREEN)
  ↓ [테스트 실행: 통과 확인]
5. QA 실행 → 통합 검증
  ├─ [PASS] → 6단계로
  ├─ [FAIL - 구현 문제] → 4단계(Implementer)로 회귀
  ├─ [FAIL - 테스트 문제] → 3단계(Test Writer)로 회귀
  └─ [FAIL - 시나리오 문제] → 2단계(Test Designer)로 회귀
  ↓
6. Refactorer 실행 → 코드 품질 개선 (REFACTOR)
  ↓ [테스트 실행: 통과 확인]
  ├─ [테스트 깨짐] → 4단계(Implementer)로 회귀
  └─ [테스트 통과] → 7단계로
  ↓
7. QA 재검증 → 최종 검증
  ├─ [PASS] → 8단계로
  └─ [FAIL] → 적절한 단계로 회귀
  ↓
8. Doc Keeper 실행 → 문서화
  ↓
Orchestrator 종료 (성공)
```

### 3.3 TDD 사이클 다이어그램

```
                    ┌─────────────────────────────┐
                    │                             │
Orchestrator 조율    │                             │
    ↓               ↓                             │
 PM → Test Designer ⇄ Test Writer ⇄ Implementer   │
                    ↓              ↓              │
                   QA ←─────────── Refactorer  ←──┘
                    ↓
                Doc Keeper
                    ↓
              [Orchestrator 완료]

기호:
→ (단방향): 정보 전달 확정
⇄ (양방향): 피드백 루프 (실패 시 회귀)
```

**핵심 원칙**:
- Orchestrator는 모든 테스트가 통과할 때까지 TDD 사이클을 반복
- 각 단계의 산출물은 명시적 형태(문서 또는 코드)로 다음 단계의 입력이 됨
- 실패 시 적절한 단계로 자동 회귀하여 문제 해결

---

## 4. 운영 원칙

- **중복 금지**: 각 에이전트의 책임은 독립적이어야 한다.
- **입출력 명확화**: "문서명" 또는 "산출물 경로"를 명시적으로 지정한다.
- **Handoff 필수**: 모든 프롬프트에는 다음 실행 대상 에이전트를 명시한다.
- **Context 보존**: 외부 문서 참조 없이 필요한 정보를 포함한다.
- **제약 명시**: 에이전트의 한계나 권한을 명확히 기술한다.
- **Git 커밋 관리**: PM은 각 에이전트의 산출물을 체크리스트 검증 후 즉시 커밋한다.
- **품질 검증**: 모든 산출물은 해당 에이전트의 체크리스트를 통과해야 한다.

---

## 5. TDD 원칙

### 5.1 TDD 사이클 (Red-Green-Refactor)

**Red (실패하는 테스트 작성)**:
- Test Designer가 설계한 시나리오를 Test Writer가 실행 가능한 테스트로 작성
- 테스트 실행 시 반드시 실패해야 함 (구현 전)
- 실패 이유가 명확해야 함

**Green (테스트 통과하는 최소 코드)**:
- Implementer가 테스트를 통과시키는 최소한의 코드 작성
- 모든 테스트가 통과할 때까지 구현
- 과도한 추상화나 최적화 금지

**Refactor (코드 개선)**:
- QA 통과 후 Refactorer가 코드 품질 개선
- 중복 제거, 명확성 향상, 디자인 패턴 적용
- 성능 최적화 및 유지보수성 개선
- 모든 테스트가 여전히 통과하는지 확인

### 5.2 TDD 에이전트 역할

**Test Designer**:
- PRD 기반 테스트 시나리오 문서 작성
- Given-When-Then 형식 테스트 케이스 정의
- 단위/통합 테스트 범위 및 경계 설정
- 테스트 데이터, Mocking 전략 수립
- **산출물**: `test-scenarios.md`

**Test Writer**:
- 테스트 시나리오를 Vitest/React Testing Library 코드로 변환
- 실패하는 테스트 작성 및 실행 확인
- 테스트 커버리지 70% 이상 목표
- **산출물**: `tests/unit/`, `tests/integration/`

**Implementer**:
- 테스트를 통과시키는 최소한의 코드 구현
- PRD의 요구사항 준수
- **산출물**: `implementation/` (실제 소스 코드 경로에 구현)

**Refactorer**:
- QA 통과 후 코드 품질 개선 및 리팩토링
- 중복 코드 제거, 가독성 향상
- 디자인 패턴 적용, 성능 최적화
- 모든 테스트 통과 확인
- **산출물**: `refactoring-report.md`, 개선된 코드

### 5.3 TDD 실행 규칙

- **테스트 먼저**: 구현 코드보다 테스트 코드를 먼저 작성
- **작은 단위**: 하나의 기능씩 Red-Green-Refactor 사이클 반복
- **지속적 통합**: 매 커밋마다 모든 테스트 실행
- **회귀 방지**: 기존 테스트가 깨지면 즉시 수정
- **테스트 독립성**: 각 테스트는 독립적으로 실행 가능해야 함

---

## 6. 산출물 관리

### 6.1 산출물 저장 위치
모든 에이전트의 산출물은 프로젝트별 디렉토리에 저장된다.

```
.claude/outputs/
└── {project-id}-{YYYYMMDD}/        # 예: PROJ-001-20250129
    ├── prd.md                       # PM 산출물 (티켓: PROJ-001)
    ├── test-scenarios.md            # Test Designer 산출물 (티켓: PROJ-002)
    ├── tests/                       # Test Writer 산출물 (티켓: PROJ-003)
    │   ├── unit/                    # 단위 테스트 코드
    │   └── integration/             # 통합 테스트 코드
    ├── implementation/              # Implementer 산출물 (티켓: PROJ-004)
    │   └── code files               # 구현 코드
    ├── qa-report.md                 # QA 산출물 (티켓: PROJ-005)
    ├── refactoring-report.md        # Refactorer 산출물 (티켓: PROJ-006)
    ├── index.md                     # Doc Keeper 산출물 (티켓: PROJ-007)
    └── final-report.md              # Doc Keeper 산출물 (티켓: PROJ-007)
```

**프로젝트 ID 형식**: `{PREFIX}-{NUMBER}-{YYYYMMDD}`
- 예시: `PROJ-001-20250129`
- 한 번에 하나의 프로젝트만 활성화

### 6.2 Git 커밋 규칙

#### 6.2.1 기본 커밋 규칙
- **커밋 시점**: 에이전트 산출물 검증 통과 직후
- **커밋 단위**: 하나의 에이전트 = 하나의 커밋
- **커밋 형식**: `<type>(<ticket-number>): [Agent명] <subject>`
- **상세 규칙**: `.claude/docs/git-commit-convention.md` 참조

#### 6.2.2 중간 커밋 기준

각 에이전트는 자신이 담당한 역할의 업무를 완료할 때마다 커밋한다.
에이전트의 전체 작업이 끝나기 전이라도, 다음 중 하나에 해당하면 **중간 커밋**을 수행한다:

**1. 기능 단위로 의미 있는 변경이 발생했을 때**
- 예: 컴포넌트 UI 마크업 완료, API 통신 로직 연결 완료
- 기준: **"하나의 기능 단위로 실행 가능한 상태"**일 경우 커밋
- 예시 커밋 메시지:
  - `feat(PROJ-004): [Implementer] Add recurring event utility functions`
  - `feat(PROJ-004): [Implementer] Implement RecurrenceSelector component`

**2. 변경 범위가 커져 복구가 어려울 수 있을 때**
- 예: 리팩토링으로 파일 구조나 인터페이스가 대폭 수정되는 경우
- 기준: 변경 규모가 커지기 전에 커밋 후 다음 단계 진행
- 예시 커밋 메시지:
  - `refactor(PROJ-006): [Refactorer] Restructure event data model`

**3. 외부 에이전트 또는 협업자가 병렬로 작업 중일 때**
- 예: Architect가 작성한 구조를 Developer가 즉시 참고해야 하는 상황
- 기준: **"다른 사람이 참고 가능한 시점"**마다 커밋
- 예시 커밋 메시지:
  - `docs(PROJ-001): [PM] Add PRD for recurring events feature`
  - `test(PROJ-002): [Test Designer] Add test scenarios`

**중간 커밋 예시**:
```
# Implementer 에이전트가 여러 컴포넌트를 구현하는 경우
feat(PROJ-004): [Implementer] Add recurring event utility functions
feat(PROJ-004): [Implementer] Implement RecurrenceSelector component
feat(PROJ-004): [Implementer] Implement RecurrenceEditModal component
feat(PROJ-004): [Implementer] Integrate recurring events into event system
feat(PROJ-004): [Implementer] Complete recurring events implementation

# 마지막 커밋이 에이전트의 최종 산출물임을 나타냄
```

---

## 7. 참조 문서

### 7.1 에이전트 정의
- **Orchestrator Agent**: `.claude/agents/orchestrator.md`
- **PM Agent**: `.claude/agents/pm.md`
- **Test Designer Agent**: `.claude/agents/test-designer.md`
- **Test Writer Agent**: `.claude/agents/test-writer.md`
- **Implementer Agent**: `.claude/agents/implementer.md`
- **QA Agent**: `.claude/agents/qa.md`
- **Refactorer Agent**: `.claude/agents/refactorer.md`
- **Doc Keeper Agent**: `.claude/agents/doc-keeper.md`

### 7.2 지원 문서
- **에이전트 생성 가이드**: `.claude/docs/agent-generate-guide.md`
- **Git 커밋 컨벤션**: `.claude/docs/git-commit-convention.md`
- **PM 출력 템플릿**: `.claude/docs/templates/pm-output.md`
- **PM 체크리스트**: `.claude/docs/check-lists/pm-checklist.md`
- **Test Designer 출력 템플릿**: `.claude/docs/templates/test-designer-output.md`
- **Test Designer 체크리스트**: `.claude/docs/check-lists/test-designer-checklist.md`
- **Test Writer 체크리스트**: `.claude/docs/check-lists/test-writer-checklist.md`
- **Implementer 체크리스트**: `.claude/docs/check-lists/implementer-checklist.md`
- **QA 출력 템플릿**: `.claude/docs/templates/qa-output.md`
- **QA 체크리스트**: `.claude/docs/check-lists/qa-checklist.md`
- **Refactorer 체크리스트**: `.claude/docs/check-lists/refactorer-checklist.md`
- **Doc Keeper 출력 템플릿**: `.claude/docs/templates/doc-keeper-output.md`
- **Doc Keeper 체크리스트**: `.claude/docs/check-lists/doc-keeper-checklist.md`

---

**최종 제어 주체:** Orchestrator
**최종 산출물:** 완성된 프론트엔드 문서 및 구현 코드 세트 (모든 테스트 통과)