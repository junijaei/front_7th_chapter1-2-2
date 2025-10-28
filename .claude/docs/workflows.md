# Frontend Agent Workflow

본 문서는 프론트엔드 프로젝트를 위한 에이전트 간 워크플로우를 정의한다.  
모든 에이전트는 **Product Manager (PM)**의 관리 하에 동작하며, PM은 각 단계의 실행 시점과 입력 데이터를 제어한다.  
워크플로우는 선형이 아닌 병렬적으로 동작할 수 있으며, 모든 산출물은 명시적으로 연결된다.

---

## 1. Agent Overview

| 순서 | 에이전트 | 주요 역할 | 입력 | 산출물 |
| ---- | -------- | -------- | ---- | ------ |
| 1 | **Product Manager (PM)** | 프로젝트 전반 관리 및 실행 제어 | PRD 초안 | 최종 PRD, 실행 플로우 |
| 2 | **Architect** | 기술 아키텍처 및 설계 정의 | PRD | Architecture 문서 |
| 3 | **UX Expert** | 사용자 흐름 및 UX 설계 | PRD, Architecture | UX 설계 문서 |
| 4 | **Product Owner (PO)** | 요구사항 검증 및 Story 분할 | PRD, UX 문서 | Epic/Story 목록 |
| 4-1 | **Story Refiner** *(PO 하위)* | Story 구체화 및 스펙 보완 | Epic/Story 목록 | Story 상세 명세 |
| 5 | **Scrum Master** | 실행 단위 및 스프린트 관리 | Story 목록 | Sprint Plan |
| 6 | **Developer (Implementer)** | 기능 구현 및 코드 작성 | Architecture, Story | 코드 산출물 |
| 7 | **QA** | 테스트 설계 및 검증 | 코드, Story | 테스트 리포트 |
| 8 | **Doc Keeper** | 산출물 인덱싱 및 문서화 | 모든 문서 | 문서 인덱스, 레포트 |

---

## 2. Workflow Overview

1. **PM**  
   - 프로젝트 시작점으로 모든 워크플로우를 관리.  
   - 각 에이전트의 입력/출력 흐름을 조율.  
   - 병렬 실행 가능한 에이전트(예: Architect ↔ UX Expert)를 동시에 호출 가능.

2. **Architect ↔ UX Expert (병렬 실행)**  
   - PRD를 기반으로 기술 구조와 사용자 흐름을 동시에 설계.  
   - 두 결과물은 PO 단계의 Story 정의에 공동으로 참조됨.

3. **PO & Story Refiner**  
   - 설계 결과를 검증 후 Epic/Story로 분할.  
   - Story Refiner가 구체적인 실행 단위로 세분화.

4. **Scrum Master**  
   - Story 기반으로 Sprint Plan 수립 및 일정 관리.  
   - Developer와 QA의 실행 순서를 제어.

5. **Developer & QA (반복 사이클)**  
   - Developer는 Story 단위로 코드 작성.  
   - QA는 각 Story 완료 후 테스트 및 검증을 수행.  
   - 검증 실패 시 Developer 단계로 회귀.

6. **Doc Keeper**  
   - 모든 산출물을 인덱싱 및 아카이빙.  
   - 문서 갱신 및 종합 리포트 생성.

---

## 3. Data Flow Summary

```

PRD → (Architect + UX Expert)
↓
(Product Owner → Story Refiner)
↓
Scrum Master
↓
(Developer ↔ QA)
↓
Doc Keeper

```

모든 단계는 PM이 조율하며, 병렬 실행과 반복 수행이 가능하다.  
각 에이전트의 산출물은 명시적 형태(문서 또는 코드)로 다음 단계의 입력이 되어야 한다.

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

## 5. 산출물 관리

### 5.1 산출물 저장 위치
모든 에이전트의 산출물은 프로젝트별 디렉토리에 저장된다.

```
.claude/outputs/
└── {project-id}-{YYYYMMDD}/        # 예: PROJ-001-20250129
    ├── prd.md                       # PM 산출물 (티켓: PROJ-001)
    ├── architecture.md              # Architect 산출물 (티켓: PROJ-002)
    ├── ux-design.md                 # UX Expert 산출물 (티켓: PROJ-003)
    ├── epics-stories.md             # PO 산출물 (티켓: PROJ-004)
    ├── sprint-plan.md               # Scrum Master 산출물 (티켓: PROJ-006)
    ├── stories/                     # Story별 산출물
    │   ├── PROJ-007/                # Story 티켓 번호
    │   │   ├── story-detail.md      # Story Refiner 산출물
    │   │   └── qa-report.md         # QA 산출물
    │   └── PROJ-008/
    │       ├── story-detail.md
    │       └── qa-report.md
    └── doc-index.md                 # Doc Keeper 산출물
```

**프로젝트 ID 형식**: `{PREFIX}-{NUMBER}-{YYYYMMDD}`
- 예시: `PROJ-001-20250129`
- 한 번에 하나의 프로젝트만 활성화

### 5.2 Git 커밋 규칙
- **커밋 시점**: 에이전트 산출물 검증 통과 직후
- **커밋 단위**: 하나의 에이전트 = 하나의 커밋
- **커밋 형식**: `<type>(<ticket-number>): [Agent명] <subject>`
- **상세 규칙**: `.claude/docs/git-commit-convention.md` 참조

---

## 6. 참조 문서

### 6.1 에이전트 정의
- **PM Agent**: `.claude/agents/pm.md`
- (추가 에이전트는 생성 시 업데이트)

### 6.2 지원 문서
- **에이전트 생성 가이드**: `.claude/docs/agent-generate-guide.md`
- **Git 커밋 컨벤션**: `.claude/docs/git-commit-convention.md`
- **PM 출력 템플릿**: `.claude/docs/templates/pm-output.md`
- **PM 체크리스트**: `.claude/docs/check-lists/pm-checklist.md`

---

**최종 제어 주체:** Product Manager
**최종 산출물:** 완성된 프론트엔드 문서 및 구현 코드 세트