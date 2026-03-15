# 직업미래연구소 웹사이트 개발일지

## 2026-03-15 (Day 1) — 프로젝트 초기 세팅 & 사이트 틀 구축

### 개요
- **프로젝트명**: 직업미래연구소 (Job Future Institute) 공식 웹사이트
- **대표**: 정동엽 직업학박사
- **리포지토리**: https://github.com/aebonlee/jdy
- **배포**: GitHub Pages

### 작업 내역

#### 1. 프로젝트 초기화
- `D:\jdy` 로컬 디렉토리에 Git 저장소 초기화
- GitHub 원격 리포지토리(`aebonlee/jdy`) 연결
- `assets/` 디렉토리 생성 (이미지 리소스용)

#### 2. index.html 작성
- 참고 사이트(나커리어연구소) 구조를 기반으로 직업미래연구소에 맞게 재구성
- **섹션 구성**:
  | 순서 | 섹션 | 설명 |
  |------|------|------|
  | 1 | Navigation | 고정 네비게이션 바 (스크롤 시 배경 변경) |
  | 2 | Hero | 메인 비주얼 + CTA 버튼 |
  | 3 | About (대표 소개) | 정동엽 박사 프로필, 학력/자격, 통계 카운터 |
  | 4 | Career (주요 경력) | 타임라인 형태 경력 나열 |
  | 5 | Expertise (특장점) | 6가지 특장점 카드 그리드 (다크 배경) |
  | 6 | Programs (프로그램) | 2개 그룹 — 진로·취업 / 연구·역량강화 |
  | 7 | History (강의이력) | 출강 대학/기관 뱃지 + 기대효과 카드 |
  | 8 | CTA (상담 신청) | 1:1 문의 & SNS 링크 |
  | 9 | Footer | 바로가기 + 연락처 |
- 플레이스홀더(`[추후 업데이트]`) 삽입 — 실제 정보 수집 후 교체 예정
- SEO: Open Graph 메타 태그 포함

#### 3. styles.css 작성
- CSS 커스텀 프로퍼티(변수) 기반 디자인 시스템
  - 브랜드 컬러: `--primary: #1a56db`, `--accent: #06b6d4`
  - 폰트: Pretendard(한글) + Outfit(영문 악센트)
- 주요 스타일링:
  - 글래스모피즘 카드 (backdrop-filter)
  - 그라디언트 히어로 배경
  - 프로필 링 (gradient border 원형)
  - 타임라인 (CSS pseudo-element 라인)
  - 스크롤 인디케이터 애니메이션
- 반응형 브레이크포인트: 1024px / 768px / 480px
- 모바일 슬라이드 메뉴

#### 4. script.js 작성
- **네비바 스크롤 이펙트**: 60px 스크롤 시 `.scrolled` 클래스 토글
- **모바일 메뉴**: 햄버거 버튼 토글 + 링크 클릭 시 자동 닫기
- **스크롤 애니메이션**: Intersection Observer로 `.fade-up-element`, `.fade-in-left`, `.fade-in-right` 감지
- **카운터 애니메이션**: `data-target` 속성 기반 숫자 카운트업 (ease-out cubic)
- **스무스 스크롤**: 앵커 링크 클릭 시 네비바 높이 보정

### 파일 구조
```
D:\jdy\
├── index.html          # 메인 페이지
├── styles.css          # 스타일시트
├── script.js           # 인터랙션 스크립트
├── DEVLOG.md           # 개발일지 (이 파일)
└── assets/             # 이미지 리소스
    └── profile.jpg     # 프로필 사진 (추후 추가)
```

### 추후 작업 예정
- [ ] 정동엽 박사 실제 프로필 정보 반영 (경력, 자격증, 학력 등)
- [ ] 프로필 사진 (`assets/profile.jpg`) 추가
- [ ] 연락처 정보 업데이트 (이메일, 전화, 주소)
- [ ] SNS 링크 및 카카오톡 채널 연결
- [ ] 출강 대학/기관 실제 데이터 반영
- [ ] QR코드 이미지 추가 (필요 시)
- [ ] 파비콘 및 OG 이미지 설정
- [ ] Google Analytics 연동

---

## 2026-03-15 (Day 1 - Update 2) — 배포 설정 & OG 태그 정비

### 작업 내역

#### 1. GitHub Pages 배포 설정
- `.github/workflows/deploy.yml` 생성
- GitHub Actions 기반 자동 배포 워크플로우 구성
  - `main` 브랜치 push 시 자동 배포
  - `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` 사용
- 배포 URL: `https://aebonlee.github.io/jdy/`

#### 2. Open Graph (OG) 메타 태그 정비
카카오톡, 슬랙 등 SNS 공유 시 미리보기에 표시되는 정보:

| 태그 | 값 |
|------|-----|
| `og:url` | `https://aebonlee.github.io/jdy/` |
| `og:title` | 직업미래연구소 \| 정동엽 직업학박사 |
| `og:description` | 직업학박사 정동엽. 직업·진로·커리어 컨설팅, AI 기반 취업전략, 직업미래 연구 및 교육 전문기관. |
| `og:type` | website |
| `og:image` | `https://aebonlee.github.io/jdy/assets/og-image.png` |
| `og:site_name` | 직업미래연구소 |

> **참고**: `og:image`에 사용할 이미지(`assets/og-image.png`)는 1200x630px 권장. 추후 추가 필요.
> 카카오 OG 캐시 초기화: https://developers.kakao.com/tool/debugger/sharing

### 추후 작업 예정
- [ ] GitHub 리포지토리 Settings → Pages → Source를 "GitHub Actions"로 설정
- [ ] OG 이미지 (`assets/og-image.png`) 제작 및 업로드
- [ ] 카카오 디버거에서 OG 캐시 초기화 확인

---

## 2026-03-15 (Day 1 - Update 3) — 실제 콘텐츠 반영

### 작업 내역

#### 1. 정동엽 박사 실제 정보 전체 반영
플레이스홀더를 모두 실제 데이터로 교체 완료.

#### 2. 소장 소개 (About) 섹션
- **자기소개**: 미래사회와 직업세계 연구, 워크넷 직업심리전문가, IT 20년 경력 내용 반영
- **학력**: 경기대 박사과정 수료(2024) / 가천대 석사(2014) / 국제문화대학원 교육학석사(2012) / 부산외국어대 공학사(1994)
- **자격**: 한국어교원 2급, 사회복지사 2급, 평생교육사 2급, 직업훈련교사 3급, 직업심리전문가, 프레디저 전문강사
- **저서**: 생각의 미래(2016), 강서구 사회적 경제(고등) 집필
- **통계 카운터**: IT 20년+ / 학위 5개 / 전문 자격 10+

#### 3. 경력사항 (Career) 섹션
- 직업미래연구소 소장 (現)
- 한국뉴욕주립대학교 Futures Master & Coach (現)
- 워크넷 직업심리전문가 (現)
- 동아방송예술대학교 겸임교수 (現, 2026)
- 아시아미래인재연구소 실장 (現)
- 아시아퓨처스그룹협동조합 사무국장 (現)
- 서울시 산업진흥원 – 신직업 자문위원, IT 플랫폼 컨설턴트, 창업닥터 (前)
- IT 분야 20년 – 교학사, 삼보컴퓨터 등 (前)

#### 4. 특장점 (Expertise) 섹션 업데이트
- 직업학 박사의 학술 전문성
- 미래학 기반 전략 컨설팅 (Futures Master)
- 전 연령층 커리어 설계
- IT 20년 + 교육정보화
- 창업·창직 전문 컨설팅
- 직업심리 전문 진단·상담

#### 5. 프로그램 (Programs) 섹션 업데이트
**그룹 1 – 커리어 경력설계 & 전직지원:**
- 미래학 기반 진로지도
- 이력서·면접 코칭
- 베이비부머 퇴직설계 프로그램

**그룹 2 – 창업·창직 & 전문가 역량 강화:**
- 창업·창직 컨설팅
- 직업심리 진단 & 자기주도 학습코칭
- 기업·기관·대학 맞춤형 출강

#### 6. 강의이력 (History) 섹션 업데이트
- 출강 대학: 동아방송예술대학교, 제주관광대학교
- 출강 기관: 한국기술교육대학교 능력개발원, 서울시 산업진흥원, 한국고용정보원 등 8개 기관
- 교육청 특강: 금산, 논산, 음성, 서산, 공주 등 8개 지원청
- 주요 강의 주제 10개 추가
- 전문 자격 및 활동 12개 뱃지 추가

#### 7. 연락처 (Footer & CTA) 업데이트
- 이메일: newjob4u@naver.com
- 전화: 010-7315-4585
- CTA 버튼: mailto 및 tel 링크 연결

### 추후 작업 예정
- [x] ~~프로필 사진 추가~~ → Update 4에서 완료
- [x] ~~OG 이미지 설정~~ → Update 4에서 완료
- [ ] GitHub Pages 배포 확인 및 활성화

---

## 2026-03-15 (Day 1 - Update 4) — 프로필 사진 반영 & OG 이미지 · 커스텀 도메인 정비

### 작업 내역

#### 1. 프로필 사진 변경
- GitHub에 업로드된 `jdy.jpg`를 프로필 이미지로 연결
- `assets/profile.jpg` → `jdy.jpg`로 경로 변경

#### 2. Open Graph 이미지 & URL 정비
커스텀 도메인(`jdy.dreamitbiz.com`)에 맞게 OG 태그 전체 업데이트:

| 태그 | 변경 전 | 변경 후 |
|------|---------|---------|
| `og:url` | `https://aebonlee.github.io/jdy/` | `https://jdy.dreamitbiz.com/` |
| `og:image` | `assets/og-image.png` (미존재) | `https://jdy.dreamitbiz.com/jdy.jpg` |

- `og:image:width`, `og:image:height` 메타 태그 추가
- Twitter Card 메타 태그(`summary_large_image`) 추가 — 트위터/X 공유 미리보기 대응

#### 3. 카카오톡 미리보기 적용 가이드
- OG 이미지로 `jdy.jpg` (프로필 사진) 사용
- 배포 후 카카오 디버거에서 캐시 초기화 필요:
  https://developers.kakao.com/tool/debugger/sharing
  → URL: `https://jdy.dreamitbiz.com/` 입력 후 "캐시 초기화" 클릭

### OG 태그 최종 상태

| 태그 | 값 |
|------|-----|
| `og:url` | `https://jdy.dreamitbiz.com/` |
| `og:title` | 직업미래연구소 \| 정동엽 직업학박사 |
| `og:description` | 직업학박사 정동엽. 미래사회와 직업세계 연구... |
| `og:type` | website |
| `og:image` | `https://jdy.dreamitbiz.com/jdy.jpg` |
| `og:site_name` | 직업미래연구소 |
| `twitter:card` | summary_large_image |

### 추후 작업 예정
- [x] ~~별도 OG 전용 이미지 제작~~ → Update 5에서 완료
- [ ] DNS 설정 확인 (`jdy.dreamitbiz.com` → GitHub Pages)
- [ ] 카카오 디버거 캐시 초기화 후 미리보기 확인

---

## 2026-03-15 (Day 1 - Update 5) — OG 전용 이미지 생성 & 경력 한문 수정

### 작업 내역

#### 1. OG 전용 이미지 생성 (`og-image.png`)
- Node.js `canvas` 패키지로 1200x630px OG 이미지 자동 생성
- 디자인 요소:
  - 다크 그라디언트 배경 (사이트 히어로와 동일 톤)
  - 상단 뱃지: "직업학박사 · 미래직업 연구 · 커리어 컨설팅 전문가"
  - 메인 타이틀: "직업미래연구소" + "정동엽 직업학박사"
  - 설명: "미래사회와 직업세계 연구 | 커리어 경력설계 | 전직지원 | 창업·창직"
  - 하단 4개 핵심 키워드 아이콘: 박사과정 수료 / IT 20년+ / Futures Master / 직업심리전문가
  - 도메인 표시: jdy.dreamitbiz.com
- `og:image` 메타 태그를 `og-image.png`로 변경 (1200x630)
- `twitter:image`도 동일하게 변경

#### 2. 경력사항 한문 수정
- "직업미래연구소 소장": **現 → 前** 변경
- "한국뉴욕주립대학교 Futures Master & Futures Coach": **現 → 前** 변경

#### 3. .gitignore 추가
- `node_modules/`, `package.json`, `package-lock.json`, `generate-og.js`, `.claude/` 제외

### OG 태그 최종 상태

| 태그 | 값 |
|------|-----|
| `og:url` | `https://jdy.dreamitbiz.com/` |
| `og:title` | 직업미래연구소 \| 정동엽 직업학박사 |
| `og:description` | 직업학박사 정동엽. 미래사회와 직업세계 연구... |
| `og:type` | website |
| `og:image` | `https://jdy.dreamitbiz.com/og-image.png` (1200x630) |
| `og:site_name` | 직업미래연구소 |

### 추후 작업 예정
- [ ] 카카오 디버거 캐시 초기화 후 미리보기 확인
- [ ] DNS 설정 확인 (`jdy.dreamitbiz.com` → GitHub Pages)

---

## 2026-03-15 (Day 1 - Update 6) — 한/영 언어 전환 기능 구현

### 작업 내역

#### 1. 언어 전환 버튼 (EN/KO)
- 네비게이션 바 우측에 원형 언어 토글 버튼 추가
- 클릭 시 한국어(KO) ↔ 영어(EN) 즉시 전환
- 스크롤 전/후 버튼 스타일 대응 (투명 → 컬러)

#### 2. i18n 시스템 구현 (script.js)
- `data-i18n` 속성: `textContent` 전환 대상
- `data-i18n-html` 속성: `innerHTML` 전환 대상 (strong, br 등 포함)
- 한국어 원본은 DOM에서 자동 캡처하여 보존
- 영어 번역 데이터 객체: 약 120개 키 번역 완료

#### 3. 번역 범위
모든 사용자 노출 텍스트를 번역:
- 네비게이션 메뉴
- 히어로 섹션 (뱃지, 타이틀, 서브타이틀, CTA)
- 소장 소개 (인용문, 본문, 학력, 자격증, 통계 라벨)
- 경력사항 (직함, 설명)
- 6가지 특장점 (제목, 설명)
- 6개 프로그램 (카테고리, 제목, 설명)
- 강의이력 (대학명, 기관명, 강의주제, 기대효과)
- CTA 섹션 & 푸터

#### 4. styles.css 업데이트
- `.lang-toggle` 원형 버튼 스타일
- `.navbar.scrolled .lang-toggle` 스크롤 시 스타일

---

## 2026-03-15 (Day 1 - Update 7) — 카카오톡 오픈채팅 & QR코드 추가 / 상담신청 밑줄 제거

### 작업 내역

#### 1. 카카오톡 오픈채팅 연결
- CTA 섹션에 카카오톡 상담 버튼 추가 (메인 CTA)
  - 링크: `https://open.kakao.com/o/stBEgxli`
- 기존 이메일/전화 버튼을 보조 버튼으로 변경

#### 2. QR코드 추가
- GitHub에 업로드된 `jdy_qr.png` 활용
- CTA 섹션 하단에 QR코드 블록 추가
- 스캔 시 카카오톡 오픈채팅으로 바로 연결
- 호버 시 "클릭하여 이동" 오버레이 표시
- 영어 번역 키 추가: `cta.kakao`, `cta.qr.caption`, `cta.qr.click`

#### 3. 상담신청 버튼 밑줄 효과 제거
- `.nav-links a::after` → `.nav-links a:not(.btn)::after`로 변경
- `.btn-outline-small` 클래스의 상담신청 버튼에서 호버 밑줄 비활성화

---

## 2026-03-15 (Day 1 - Update 8) — 다크/라이트 테마 전환 기능

### 작업 내역

#### 1. 테마 토글 버튼
- EN 버튼 옆에 해/달 아이콘 원형 토글 버튼 추가
- 라이트 모드: 해(sun) 아이콘 표시 → 클릭 시 다크 모드 전환
- 다크 모드: 달(moon) 아이콘 표시 → 클릭 시 라이트 모드 복귀
- `localStorage`에 테마 저장 → 재방문 시 유지

#### 2. CSS 다크 테마 변수 & 오버라이드
- `[data-theme="dark"]` CSS 변수 재정의 (배경, 텍스트, 보더 등)
- 다크 모드 대응 영역:
  - 네비바 (스크롤 전/후)
  - About/Career/Programs 라이트 섹션 → 다크 배경 전환
  - 인증 카드, 경력 타임라인, 프로그램 카드
  - 통계 카운터, 섹션 헤더, 디바이더
  - 프로필 프레임, 프로그램 아이콘
- 기존 `.dark-section`(특장점/강의이력)은 원래 다크이므로 변경 없음

#### 3. 아이콘 애니메이션
- 해↔달 전환 시 `opacity` + `rotate` 트랜지션

---

## 2026-03-15 (Day 1 - Update 9) — 파비콘 생성 & 적용

### 작업 내역

#### 1. 파비콘 이미지 생성 (Node.js canvas)
| 파일 | 크기 | 디자인 |
|------|------|--------|
| `favicon-16.png` | 16x16 | 다크블루 원형 + "JF" 흰색 텍스트 |
| `favicon-32.png` | 32x32 | 다크블루 원형 + 시안 링 + "JF" 흰색 텍스트 |
| `apple-touch-icon.png` | 180x180 | 다크 그라디언트 라운드렉트 + "직업" / "미래" + "JOB FUTURE" |

#### 2. index.html 메타 태그 추가
```html
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
```

---

## 2026-03-15 (Day 1 - Update 10) — 컬러 팔레트 피커 기능 추가

### 작업 내역

#### 1. 컬러 팔레트 토글 버튼
- 테마(해/달) 토글 옆에 팔레트 아이콘 원형 버튼 추가
- 클릭 시 5가지 컬러 스와치 드롭다운 표시
- 바깥 영역 클릭 시 드롭다운 자동 닫기

#### 2. 5가지 배경 컬러 테마
| 테마 | Primary | Accent | 설명 |
|------|---------|--------|------|
| Default (블루) | `#1a56db` | `#06b6d4` | 기본 테마 |
| Emerald (에메랄드) | `#059669` | `#14b8a6` | 초록 계열 |
| Purple (퍼플) | `#7c3aed` | `#a78bfa` | 보라 계열 |
| Rose (로즈) | `#e11d48` | `#f43f5e` | 장미 계열 |
| Amber (앰버) | `#d97706` | `#f59e0b` | 호박 계열 |

#### 3. CSS 구현 (`[data-color]` 속성 기반)
- 각 컬러 테마별 CSS 커스텀 프로퍼티 재정의
- Hero 섹션, CTA 섹션, 프로그램 헤더의 그라디언트도 컬러별 오버라이드
- `.color-toggle`, `.color-dropdown`, `.color-swatch` 스타일 추가
- 선택된 스와치에 체크마크(✓) + 링 표시

#### 4. JavaScript 구현
- `localStorage('color')` 키로 선택 컬러 저장 → 재방문 시 유지
- `data-color` 속성을 `<html>` 요소에 적용
- 다크/라이트 테마와 독립적으로 작동 (조합 가능)

### 기술 포인트
- **다크/라이트 테마** (`data-theme`) + **컬러 팔레트** (`data-color`) = 총 10가지 조합
- 두 시스템이 독립 데이터 속성으로 동작하여 충돌 없음

---

## 2026-03-15 (Day 1 - Update 11) — Font Awesome 아이콘 교체 & JS 인터랙션 강화

### 작업 내역

#### 1. Font Awesome 6 아이콘 도입
- Font Awesome 6.5.1 CDN 추가
- 사이트 전체의 이모지를 Font Awesome 아이콘으로 교체하여 "AI 생성 느낌" 제거

| 영역 | 이모지 → FA 아이콘 |
|------|---------------------|
| 학력 (cert) | 🎓 → `fa-graduation-cap` |
| 저서 | 📚 → `fa-book` |
| 자격증 | 📋 → `fa-clipboard-list` |
| 심리 전문 | 🧠 → `fa-brain` |
| 프로그램 | 🔬📄🔄🚀📊🎓 → `fa-microscope`, `fa-file-lines`, `fa-arrows-rotate`, `fa-rocket`, `fa-chart-bar`, `fa-graduation-cap` |
| 출강 대학 | 🏫 → `fa-school` |
| 출강 기관 | 🏢 → `fa-building` |
| 교육청 | 🏛️ → `fa-landmark` |
| 강의 주제 | 📋 → `fa-clipboard-list` |
| 전문 자격 | 🏅 → `fa-award` |
| 기대효과 | 💪🏛️ → `fa-chart-line`, `fa-building-columns` |
| 체크마크 | ✓ → FA `\f00c` (Font Awesome 체크) |

#### 2. 네비게이션 토글 버튼 그룹화
- EN, 해/달, 팔레트 3개 버튼을 `.nav-toggles` div로 그룹핑
- 버튼 간격: `gap: 6px` (기존 32px → 6px)

#### 3. CSS 아이콘 인터랙션 효과 추가
- `.cert-item` hover 시 아이콘 확대 + 색상 변경 (`scale(1.2)`, accent 컬러)
- `.program-icon` hover 시 회전 + 확대 (`scale(1.1) rotate(-5deg)`)
- `.icon-wrapper` (특장점 카드) hover 시 회전 + 확대
- `.career-dot` 타임라인 점 펄스 애니메이션 (`dotPulse` keyframe)
- 체크마크 `li::before` Font Awesome 폰트로 전환

#### 4. JavaScript 효과 추가

| 효과 | 설명 |
|------|------|
| 스크롤 진행 바 | 페이지 상단 3px 프로그레스 라인 (primary → accent 그라디언트) |
| Back-to-Top 버튼 | 500px 스크롤 시 우하단에 화살표 버튼 표시, 클릭 시 최상단 이동 |
| 네비 활성 링크 | 현재 보고 있는 섹션의 네비 메뉴 자동 하이라이트 |
| 뱃지 순차 등장 | 강의이력 뱃지들이 60ms 간격으로 순서대로 페이드인 (staggered) |
| 히어로 패럴랙스 | 스크롤 시 히어로 콘텐츠 서서히 위로 이동 + 투명도 감소 |

#### 5. i18n 번역 업데이트
- 영어 번역에서 이모지 접두사 제거 (아이콘이 별도 `<i>` 요소로 분리되었으므로)
- `data-i18n` 속성을 `<span>` 내부로 이동 (아이콘과 텍스트 분리)

#### 6. 다크 테마 아이콘 대응
- `.cert-icon`, `.program-icon` 다크 모드에서 accent 컬러로 전환

---

## 2026-03-15 (Day 1 - Update 12) — 스크롤 바 제거 & 배경 오브 애니메이션 적용

### 작업 내역

#### 1. 스크롤 진행 바 제거
- 상단 3px 프로그레스 라인 삭제 (HTML, CSS, JS 모두 제거)
- 지저분한 시각 요소 제거로 깔끔한 상단 유지

#### 2. 히어로 배경 — 부유 오브 (Floating Orbs)
- 3개의 그라디언트 오브(`.hero-orb`)가 천천히 떠다니는 CSS 애니메이션 적용
- `filter: blur(80px)` + `opacity: 0.12`로 은은한 빛 효과
- 각 오브 별도 keyframe (`orbFloat1/2/3`) — 서로 다른 속도·방향으로 움직임

| 오브 | 크기 | 색상 | 애니메이션 |
|------|------|------|------------|
| orb-1 | 500px | accent | 20s |
| orb-2 | 350px | primary-light | 25s |
| orb-3 | 250px | accent-light | 18s |

#### 3. 라이트 섹션 배경 효과
- About 섹션: 우상단 원형 그라디언트 오브 부유 (`sectionOrb` 20s)
- Programs 섹션: 좌하단 원형 그라디언트 오브 부유 (`sectionOrb` 25s reverse)

#### 4. 다크 섹션 배경 효과
- 특장점·강의이력: 중앙 시안 빛 오브 부유 (`darkOrb` 22s)
- CTA 섹션: 우상단 시안 빛 오브 부유 (`orbFloat1` 18s)

#### 5. 네비 토글 버튼 간격 조정
- `.nav-toggles`에 `flex-direction: row`, `flex-wrap: nowrap`, `flex-shrink: 0` 명시
- `.nav-links` gap: 32px → 20px
- 3개 버튼이 반드시 1줄로 나열되도록 강제

---

## 2026-03-15 (Day 1 - Update 13) — 경력 타임라인 좌우 배치 & 프로그램 2개 추가

### 작업 내역

#### 1. Career History 타임라인 — 좌우 지그재그 레이아웃
- 중앙 세로선 기준으로 홀수(1,3,5,7) 왼쪽 / 짝수(2,4,6,8) 오른쪽 배치
- 세로 영역 약 절반으로 축소
- 호버 시 좌측 항목은 왼쪽으로, 우측 항목은 오른쪽으로 슬라이드
- 모바일 (768px 이하): 기존 1열 레이아웃으로 자동 전환

#### 2. 프로그램 2개 그룹 추가

**그룹 3 — Gen AI시대 AI리터러시 향상 프로그램:**

| 프로그램 | 아이콘 | 설명 |
|----------|--------|------|
| 생성형 AI 활용 실무 | `fa-robot` | ChatGPT, Copilot 등 생성형 AI 실전 활용 |
| AI 리터러시 & 프롬프트 엔지니어링 | `fa-brain` | 디지털 문해력, 프롬프트 작성법, AI 윤리 |
| AI 기반 커리어 전략 수립 | `fa-wand-magic-sparkles` | AI 도구 활용 이력서·면접·로드맵 설계 |

**그룹 4 — 외국인으로 한국에서 살아가기 프로젝트:**

| 프로그램 | 아이콘 | 설명 |
|----------|--------|------|
| 한국 생활 적응 & 문화 이해 | `fa-earth-asia` | 한국 생활문화·제도·사회 규범 안내 |
| 한국어 교육 & 의사소통 역량 강화 | `fa-language` | 한국어교원 2급 기반 실용 한국어 교육 |
| 외국인 취업·창업 컨설팅 | `fa-briefcase` | 취업 절차, 이력서·면접 코칭, 비자별 창업 가이드 |

#### 3. i18n 영어 번역 추가
- `prog.g3.*`, `prog.7~9.*` (AI 리터러시 프로그램) 영어 번역 18개 키 추가
- `prog.g4.*`, `prog.10~12.*` (외국인 프로젝트) 영어 번역 18개 키 추가

---

## 2026-03-15 (Day 1 - Update 14) — About 섹션 리디자인 & 경력 타임라인 겹침 효과

### 작업 내역

#### 1. About 섹션 전면 리디자인
- 기존 2열 글래스 카드 레이아웃에서 완전히 새로운 구조로 변경 (디자인 유사성 해소)
- **새 레이아웃 구조**:

| 영역 | 설명 |
|------|------|
| `.about-intro` | 가로형 인트로 카드 (좌: 프로필+통계, 우: 인용문+소개) |
| `.about-cards` | 3열 자격 카드 그리드 (학력 / 자격&활동 / 저서) |

- `.about-intro`: flex 레이아웃, 프로필 사진(180px)과 통계 카운터를 좌측에, 인용문과 소개글을 우측에 배치
- `.about-cards`: 3개 카드에 FA 아이콘 헤더 (`fa-graduation-cap`, `fa-clipboard-list`, `fa-book`) + 체크마크 리스트
- 다크 테마 전체 대응: `.about-intro`, `.about-quote`, `.about-card` 등 다크 모드 오버라이드 추가

#### 2. About 섹션 모바일 반응형
- 768px 이하: `.about-intro` → `flex-direction: column`, 프로필 150px
- 768px 이하: `.about-cards` → 1열 그리드

#### 3. 경력 타임라인 — 1/2 겹침 효과
- 지그재그 레이아웃에서 인접 항목을 약 50px 겹쳐 세로 영역 축소
- `.career-item:not(:first-child) { margin-top: -50px; }`
- 좌/우 항목이 서로 다른 면에 위치하므로 시각적으로 깔끔한 겹침
- 모바일 (768px 이하): 겹침 해제, `margin-bottom: 16px`으로 복원

#### 4. i18n 번역 추가
- `about.card1.title`: 'Education'
- `about.card2.title`: 'Certifications & Activities'
- `about.card3.title`: 'Publications'

---

## 2026-03-15 (Day 1 - Update 15) — About 섹션 프리미엄 이그제큐티브 리디자인

### 개요
기존 About 섹션의 단순한 밝은 배경 카드(`.about-intro`) + 3열 그리드를 전면 리디자인하여, 전문가 프로필에 걸맞은 프리미엄 이그제큐티브 디자인으로 변경.

### 작업 내역

#### 1. 다크 그라디언트 인트로 배너 (`.about-banner`)
- **배경**: 히어로와 유사한 다크 그라디언트 (`linear-gradient(135deg, var(--primary-dark), #0f172a, #0c4a6e)`)
- **프로필**: 220px 크기 `conic-gradient` 회전 링 (`@keyframes ringRotate` 6s 무한) + 사진 역회전으로 정지 효과
- **글로우 이펙트**: `box-shadow: 0 0 40px rgba(6, 182, 212, 0.2), 0 0 80px rgba(26, 86, 219, 0.1)`
- **이름**: 그라디언트 텍스트 (`#fff` → `accent-light`)로 프리미엄 타이포
- **직함**: 반투명 흰색 (`rgba(255,255,255,0.6)`)
- **인용문**: Font Awesome `fa-quote-left` 3rem 장식 아이콘 (15% opacity) + 밝은 텍스트
- **통계**: 글래스모피즘 알약형 뱃지 (`.stat-pill`) — `backdrop-filter: blur(12px)`, 반투명 보더, 호버 시 시안 글로우
- **5가지 컬러 팔레트 대응**: emerald / purple / rose / amber 각각 배너 그라디언트 오버라이드

#### 2. 본문 소개 영역 (`.about-bio`)
- 배너 아래 별도 영역으로 분리
- 좌측 3px accent 보더라인 + `line-height: 1.9`
- `max-width: 900px` 중앙 정렬

#### 3. 프리미엄 자격 카드 (`.about-card`)
- **상단 4px 그라디언트 보더 스트립** (`::before`): primary → accent
- **아이콘**: 56px 원형 그라디언트 배경 (`linear-gradient(135deg, primary, accent)`) + 흰색 아이콘
- **장식적 카드 번호**: `data-card-num` 속성으로 "01", "02", "03" 우상단 표시 (8% opacity)
- **호버**: `translateY(-6px)` + 다중 레이어 그림자 + 상단 보더 글로우 (`box-shadow: 0 0 16px`)

#### 4. 반응형 (768px 이하)
- 배너: `flex-direction: column`, 프로필 180px, 텍스트 `text-align: center`
- 인용문 아이콘: `position: static`, 중앙 정렬
- 통계 알약: `justify-content: center`
- 카드: 1열 그리드

#### 5. 다크 테마 대응
- 배너: 기본이 다크이므로 변경 최소
- 카드: 기존 다크 변수 활용 + 카드 번호/아이콘 accent 컬러 전환

#### 6. i18n 번역 키 추가
| 키 | 한국어 | 영어 |
|----|--------|------|
| `about.name` | 정동엽 | Dong-Yeop Jung |
| `about.role` | 직업학박사 · 직업미래연구소 소장 | PhD in Vocational Studies · Director, Job Future Institute |

### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `index.html` | About 섹션 HTML 구조 전면 변경 (배너 + 바이오 + 카드) |
| `styles.css` | About CSS 전면 교체 + `@keyframes ringRotate/ringRotateReverse` + 컬러 팔레트 배너 오버라이드 |
| `script.js` | `about.name`, `about.role` 영어 번역 키 추가 |

### 기술 포인트
- **`conic-gradient` + `animation: ringRotate`**: 프로필 사진 테두리가 무한 회전하는 프리미엄 효과
- **`backdrop-filter: blur(12px)`**: 글래스모피즘 스타일 통계 알약 뱃지
- **`attr(data-card-num)`**: CSS `content` 속성으로 카드 번호 동적 표시
- **다크 배너 + 라이트 카드**: 섹션 내 명암 대비로 시각적 깊이감 확보

---

## 2026-03-15 (Day 1 - Update 16) — About 자격 카드 그리드 상단 여백 추가

### 작업 내역
- `.about-cards`에 `margin-top: 30px` 추가
- 학력 / 자격&전문활동 / 저서 카드 그리드와 바이오 영역 사이 30px 여백 확보

### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `styles.css` | `.about-cards` — `margin-top: 30px` 추가 |

---
*Updated on 2026-03-15*
