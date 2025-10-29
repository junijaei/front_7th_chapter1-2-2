# Architect Agent Output Template

**버전:** 1.0.0
**생성일:** 2025-10-29
**목적:** Architect 에이전트의 산출물 형식 및 구조 정의

---

## 산출물 개요

Architect 에이전트는 **Architecture 문서**를 주요 산출물로 생성한다.

### 파일 정보
- **파일명**: `architecture.md`
- **경로**: `.claude/outputs/{project-id}-{YYYYMMDD}/architecture.md`
- **예시**: `.claude/outputs/PROJ-001-20250129/architecture.md`
- **티켓**: PROJ-002
- **목적**: 기술 스택, 시스템 아키텍처, 컴포넌트 구조, 데이터 흐름 정의

---

## Architecture 문서 템플릿

```markdown
# Technical Architecture

**프로젝트명**: [프로젝트 이름]
**버전**: 1.0.0
**작성일**: YYYY-MM-DD
**작성자**: Architect Agent
**프로젝트 ID**: [project-id]-[YYYYMMDD]
**티켓**: PROJ-002

---

## 1. 개요

### 1.1 문서 목적
이 문서는 [프로젝트명]의 기술 아키텍처를 정의한다.

### 1.2 참조 문서
- **PRD**: `.claude/outputs/[project-id]-[YYYYMMDD]/prd.md`

### 1.3 아키텍처 원칙
[이 프로젝트의 아키텍처 설계 원칙]
- 원칙 1: [예: 모듈화 및 관심사 분리]
- 원칙 2: [예: 테스트 가능성]
- 원칙 3: [예: 확장 가능성]
- 원칙 4: [예: 성능 우선]

---

## 2. 기술 스택

### 2.1 코어 기술

| 카테고리 | 기술 | 버전 | 선택 근거 |
|---------|------|------|-----------|
| 프레임워크 | [React/Vue/Angular] | [버전] | [근거] |
| 언어 | [TypeScript/JavaScript] | [버전] | [근거] |
| 빌드 도구 | [Vite/Webpack] | [버전] | [근거] |

### 2.2 상태 관리

| 라이브러리 | 버전 | 용도 | 선택 근거 |
|-----------|------|------|-----------|
| [Redux/Zustand/Recoil] | [버전] | [전역 상태 관리] | [근거] |

### 2.3 UI 라이브러리 및 스타일링

| 카테고리 | 라이브러리 | 버전 | 선택 근거 |
|---------|-----------|------|-----------|
| Component Library | [Material-UI/Ant Design/없음] | [버전] | [근거] |
| 스타일링 | [CSS Modules/Styled-Components/Tailwind] | [버전] | [근거] |
| 아이콘 | [Font Awesome/Material Icons] | [버전] | [근거] |

### 2.4 유틸리티 라이브러리

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| [date-fns/Day.js] | [버전] | 날짜/시간 처리 |
| [axios/fetch] | [버전] | HTTP 클라이언트 |
| [기타] | [버전] | [용도] |

### 2.5 개발 도구

| 도구 | 버전 | 용도 |
|-----|------|------|
| ESLint | [버전] | 코드 품질 검사 |
| Prettier | [버전] | 코드 포맷팅 |
| [기타] | [버전] | [용도] |

### 2.6 선택하지 않은 대안 및 이유

| 대안 기술 | 선택하지 않은 이유 |
|----------|-------------------|
| [기술명] | [이유] |

---

## 3. 시스템 아키텍처

### 3.1 전체 구조도

```
[시스템 구조 다이어그램]

예시:
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (Components, Pages, UI Logic)          │
├─────────────────────────────────────────┤
│          Business Logic Layer           │
│  (Hooks, Services, State Management)    │
├─────────────────────────────────────────┤
│            Data Layer                   │
│  (API, LocalStorage, Cache)             │
└─────────────────────────────────────────┘
```

### 3.2 계층별 책임

#### 3.2.1 Presentation Layer
**책임**:
- 사용자 인터페이스 렌더링
- 사용자 입력 처리
- UI 상태 관리

**주요 구성요소**:
- Pages: 라우팅 기반 페이지 컴포넌트
- Components: 재사용 가능한 UI 컴포넌트
- Layouts: 페이지 레이아웃 컴포넌트

#### 3.2.2 Business Logic Layer
**책임**:
- 비즈니스 로직 처리
- 데이터 가공 및 변환
- 전역 상태 관리

**주요 구성요소**:
- Custom Hooks: 재사용 가능한 로직
- Services: 비즈니스 로직 캡슐화
- Store: 전역 상태 저장소

#### 3.2.3 Data Layer
**책임**:
- 외부 데이터 소스와의 통신
- 데이터 캐싱
- 로컬 데이터 저장

**주요 구성요소**:
- API Client: HTTP 요청 처리
- Storage: LocalStorage/SessionStorage 관리
- Cache: 데이터 캐싱 로직

---

## 4. 컴포넌트 아키텍처

### 4.1 컴포넌트 계층 구조

```
App
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Footer
├── Pages
│   ├── HomePage
│   ├── [Feature]Page
│   └── ...
└── Common Components
    ├── Button
    ├── Input
    ├── Modal
    └── ...
```

### 4.2 컴포넌트 분류

#### 4.2.1 페이지 컴포넌트 (Pages)
- **특징**: 라우팅과 직접 연결
- **책임**: 페이지 레벨 상태 관리, 하위 컴포넌트 조합
- **명명 규칙**: `[Name]Page.tsx`

#### 4.2.2 기능 컴포넌트 (Features)
- **특징**: 특정 기능을 담당하는 컴포넌트
- **책임**: 기능별 비즈니스 로직 포함
- **명명 규칙**: `[FeatureName].tsx`

#### 4.2.3 공통 컴포넌트 (Common)
- **특징**: 재사용 가능한 범용 컴포넌트
- **책임**: UI 렌더링, 기본 상호작용
- **명명 규칙**: `[ComponentName].tsx`

### 4.3 컴포넌트 설계 원칙

1. **단일 책임 원칙**: 하나의 컴포넌트는 하나의 역할만
2. **Props 최소화**: 필요한 Props만 전달
3. **합성 우선**: 상속보다 합성 사용
4. **컨테이너/프레젠테이셔널 분리**: 필요시 로직과 UI 분리

---

## 5. 상태 관리

### 5.1 상태 관리 전략

```
[전역 상태]           [로컬 상태]
- 사용자 인증         - 폼 입력값
- 앱 설정             - 모달 열림/닫힘
- 공유 데이터         - 컴포넌트 UI 상태
```

### 5.2 상태 관리 구조

#### 5.2.1 전역 상태
[Redux/Zustand/Recoil 사용 시 구조]

```typescript
// 예시: Redux Toolkit
interface RootState {
  auth: AuthState;
  [feature]: [Feature]State;
  // ...
}
```

#### 5.2.2 로컬 상태
- React Hook (`useState`, `useReducer`) 사용
- 컴포넌트 내부에서만 사용되는 상태

### 5.3 상태 업데이트 흐름

```
User Action → Dispatch Action → Reducer → State Update → UI Re-render
```

---

## 6. 데이터 흐름

### 6.1 API 통신 패턴

#### 6.1.1 HTTP 클라이언트 설정
```typescript
// 예시
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### 6.1.2 API 요청 흐름
```
Component → Hook → Service → API Client → Server
                                          ↓
Component ← Hook ← Service ← Response ←──┘
```

### 6.2 에러 핸들링

| 에러 유형 | 처리 방법 |
|---------|----------|
| 네트워크 에러 | 재시도 로직 + 사용자 알림 |
| 4xx 에러 | 에러 메시지 표시 |
| 5xx 에러 | 폴백 UI + 로깅 |

### 6.3 데이터 캐싱 전략

| 데이터 유형 | 캐싱 방법 | 유효 기간 |
|-----------|----------|----------|
| 사용자 정보 | LocalStorage | 세션 유지 |
| 일시적 데이터 | SessionStorage | 탭 닫을 때까지 |
| API 응답 | 메모리 캐시 | [N분] |

---

## 7. 라우팅 설계

### 7.1 라우팅 구조

| 경로 | 컴포넌트 | 설명 | 접근 권한 |
|-----|---------|------|----------|
| `/` | HomePage | 홈 페이지 | Public |
| `/[feature]` | [Feature]Page | [기능] 페이지 | [권한] |

### 7.2 동적 라우팅

```typescript
// 예시
/events/:eventId
/users/:userId/profile
```

### 7.3 라우팅 가드
- 인증 필요 페이지: 로그인 확인 후 접근
- 권한 필요 페이지: 권한 확인 후 접근
- 미인증 사용자: 로그인 페이지로 리다이렉트

---

## 8. 디렉토리 구조

```
src/
├── assets/              # 정적 리소스 (이미지, 폰트 등)
├── components/          # 공통 컴포넌트
│   ├── common/          # 범용 UI 컴포넌트
│   └── layout/          # 레이아웃 컴포넌트
├── features/            # 기능별 컴포넌트
│   └── [feature]/
│       ├── components/  # 기능별 컴포넌트
│       ├── hooks/       # 기능별 커스텀 훅
│       └── types/       # 기능별 타입 정의
├── hooks/               # 공통 커스텀 훅
├── pages/               # 페이지 컴포넌트
├── services/            # 비즈니스 로직, API 호출
├── store/               # 상태 관리
│   ├── slices/          # Redux Toolkit Slices
│   └── index.ts         # Store 설정
├── types/               # 공통 타입 정의
├── utils/               # 유틸리티 함수
├── styles/              # 전역 스타일
├── App.tsx              # 루트 컴포넌트
└── main.tsx             # 진입점
```

### 8.1 파일 명명 규칙
- 컴포넌트: PascalCase (`Button.tsx`)
- 훅: camelCase + use 접두사 (`useAuth.ts`)
- 유틸리티: camelCase (`formatDate.ts`)
- 타입: PascalCase + Type/Interface (`UserType.ts`)

---

## 9. 성능 최적화

### 9.1 렌더링 최적화

| 기법 | 적용 대상 | 설명 |
|-----|----------|------|
| React.memo | 순수 컴포넌트 | Props 변경 시에만 리렌더링 |
| useMemo | 비용 큰 계산 | 의존성 변경 시에만 재계산 |
| useCallback | 콜백 함수 | 함수 재생성 방지 |

### 9.2 코드 분할 (Code Splitting)

```typescript
// 예시: 라우트 기반 코드 분할
const HomePage = lazy(() => import('./pages/HomePage'));
const FeaturePage = lazy(() => import('./pages/FeaturePage'));
```

### 9.3 번들 최적화
- Tree Shaking 활성화
- 사용하지 않는 라이브러리 제거
- Dynamic Import 활용

### 9.4 이미지 최적화
- Lazy Loading 적용
- WebP 포맷 사용
- 적절한 이미지 크기 사용

---

## 10. 보안 및 품질

### 10.1 보안 고려사항

| 위협 | 방어 방법 |
|-----|----------|
| XSS | 입력 값 이스케이프, dangerouslySetInnerHTML 사용 금지 |
| CSRF | CSRF 토큰 사용 |
| 민감 데이터 노출 | 환경 변수 사용, 하드코딩 금지 |

### 10.2 접근성 (A11y)
- Semantic HTML 사용
- ARIA 레이블 추가
- 키보드 네비게이션 지원
- 색상 대비 확보

### 10.3 코드 품질
- TypeScript 사용 (타입 안정성)
- ESLint 규칙 준수
- Prettier 자동 포매팅
- 단위 테스트 작성 (70% 이상 커버리지 목표)

---

## 11. 개발 가이드라인

### 11.1 코딩 컨벤션
**상세 가이드**: `.claude/docs/code-quality/frontend-code.md` 참조

**요약**:
- 함수: camelCase
- 컴포넌트: PascalCase
- 상수: UPPER_SNAKE_CASE
- 파일명: 컴포넌트는 PascalCase, 나머지는 camelCase

### 11.2 Git 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `fix/*`: 버그 수정 브랜치

### 11.3 커밋 컨벤션
**상세 규칙**: `.claude/docs/git-commit-convention.md` 참조

---

## 12. 의존성 및 제약사항

### 12.1 외부 의존성
- [라이브러리명]: [용도] - [제약사항]

### 12.2 브라우저 지원
- Chrome: 최신 2개 버전
- Firefox: 최신 2개 버전
- Safari: 최신 2개 버전
- Edge: 최신 2개 버전

### 12.3 성능 요구사항
- First Contentful Paint (FCP): < 1.8초
- Time to Interactive (TTI): < 3.9초
- Cumulative Layout Shift (CLS): < 0.1

---

## 13. 향후 고려사항

### 13.1 확장성
- [향후 추가될 기능에 대한 확장 방안]

### 13.2 마이그레이션 계획
- [필요시 기술 스택 업그레이드 계획]

---

## 14. 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | YYYY-MM-DD | Architect | 초안 작성 |

---

**다음 단계**: Product Owner에게 전달 (UX Design과 함께)
```

---

## 출력 위치 및 파일 관리

### 파일 경로
- **Architecture 문서**: `.claude/outputs/{project-id}-{YYYYMMDD}/architecture.md`
- **예시**: `.claude/outputs/PROJ-001-20250129/architecture.md`

### 다이어그램 포함 권장사항
- ASCII 아트 또는 Mermaid 다이어그램 사용
- 시스템 구조도, 컴포넌트 트리, 데이터 흐름도 포함
- 복잡한 다이어그램은 별도 이미지 파일로 관리 가능

---

**이 템플릿은 Architect 에이전트가 산출물을 생성할 때 반드시 따라야 하는 표준 형식이다.**
