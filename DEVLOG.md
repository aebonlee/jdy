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
*Updated on 2026-03-15*
