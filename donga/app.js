'use strict';

// ============================================================
// 동아방송대 발표평가 시스템 - 공유 유틸리티
// ⚠️  anon key만 클라이언트에서 사용 (service role key는 서버 전용)
// ============================================================

const SUPABASE_URL      = 'https://hcmgdztsgjvzcyxyayaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWdkenRzZ2p2emN5eHlheWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU4ODcsImV4cCI6MjA4NzAxMTg4N30.gznaPzY1l8qDAPsEyYNR9KS7f7VqS3xaw-_2HTSwSZw';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// Auth
// ============================================================

async function jdy_signInGoogle() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: _redirectTo() }
  });
  if (error) jdy_toast('error', 'Google 로그인 실패: ' + error.message);
}

async function jdy_signInKakao() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'kakao',
    options: { redirectTo: _redirectTo() }
  });
  if (error) jdy_toast('error', '카카오 로그인 실패: ' + error.message);
}

async function jdy_signOut() {
  await sb.auth.signOut();
  location.href = _basePath() + 'index.html';
}

/** OAuth 메타데이터에서 표시 이름을 추출. email이 null인 소셜 계정 대비 */
function jdy_fallbackName(session) {
  const meta  = session.user.user_metadata || {};
  const email = session.user.email || '';
  return meta.full_name || meta.name || (email ? email.split('@')[0] : '');
}

function _redirectTo() {
  // 현재 페이지(donga/) 기준으로 콜백 URL 결정
  const base = location.origin + _basePath();
  return base + 'index.html';
}

function _basePath() {
  // '/donga/' 또는 '/jdy/donga/' 등 경로 자동 감지
  const p = location.pathname;
  const idx = p.lastIndexOf('/donga/');
  return idx !== -1 ? p.slice(0, idx + 7) : '/donga/';
}

// ============================================================
// Profile
// ============================================================

async function jdy_getSession() {
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

async function jdy_getProfile(userId) {
  const { data, error } = await sb
    .from('jdy_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) { console.error('getProfile:', error); return null; }
  return data;
}

async function jdy_upsertProfile(fields) {
  const session = await jdy_getSession();
  if (!session) return { error: '로그인이 필요합니다.' };
  const { error } = await sb
    .from('jdy_profiles')
    .upsert({ id: session.user.id, email: session.user.email, ...fields },
             { onConflict: 'id' });
  return { error };
}

// ============================================================
// Courses
// ============================================================

async function jdy_getCourses(activeOnly = true) {
  let q = sb.from('jdy_courses').select('*, instructor:jdy_profiles(full_name)');
  if (activeOnly) q = q.eq('is_active', true);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) { console.error('getCourses:', error); return []; }
  return data || [];
}

async function jdy_getMyEnrollments(userId) {
  const { data, error } = await sb
    .from('jdy_enrollments')
    .select('*, course:jdy_courses(*)')
    .eq('student_id', userId);
  if (error) { console.error('getEnrollments:', error); return []; }
  return data || [];
}

async function jdy_enroll(courseId) {
  const session = await jdy_getSession();
  if (!session) return { error: '로그인이 필요합니다.' };
  const { error } = await sb.from('jdy_enrollments').insert({
    student_id: session.user.id,
    course_id: courseId
  });
  return { error };
}

async function jdy_unenroll(courseId) {
  const session = await jdy_getSession();
  if (!session) return { error: '로그인이 필요합니다.' };
  const { error } = await sb.from('jdy_enrollments')
    .delete()
    .eq('student_id', session.user.id)
    .eq('course_id', courseId);
  return { error };
}

// Dashboard: 교수자 전용 ──────────────────────────────────
async function jdy_getCourseStudents(courseId) {
  const { data, error } = await sb
    .from('jdy_enrollments')
    .select('student:jdy_profiles(id, full_name, student_id, email)')
    .eq('course_id', courseId);
  if (error) { console.error('getCourseStudents:', error); return []; }
  return (data || []).map(r => r.student).filter(Boolean);
}

// ============================================================
// 발표평가 항목 정의 (공통 상수)
// ============================================================

const JDY_PITCH_CRITERIA = [
  { col: 'score_self_understanding', label: '자기이해+적성', max: 20 },
  { col: 'score_startup_item',       label: '창업아이템',    max: 15 },
  { col: 'score_macro_env',          label: '거시환경',      max: 15 },
  { col: 'score_customer_market',    label: '고객/시장',     max: 10 },
  { col: 'score_revenue',            label: '수익구조',      max: 15 },
  { col: 'score_execution',          label: '실행준비',      max: 15 },
  { col: 'score_support_strategy',   label: '지원전략',      max: 10 },
];

// ============================================================
// 발표평가 DB 함수
// ============================================================

/** 내가 작성한 발표평가 목록 */
async function jdy_getMyPitchEvals(courseId, myId) {
  const { data, error } = await sb
    .from('jdy_pitch_evaluations')
    .select('*')
    .eq('course_id', courseId)
    .eq('evaluator_id', myId);
  if (error) { console.error('getMyPitchEvals:', error); return []; }
  return data || [];
}

/** 발표평가 일괄 저장 (upsert) */
async function jdy_savePitchEvalsBatch(evals) {
  const session = await jdy_getSession();
  if (!session) return { error: '로그인이 필요합니다.' };
  const rows = evals.map(e => ({ ...e, evaluator_id: session.user.id }));
  const { error } = await sb
    .from('jdy_pitch_evaluations')
    .upsert(rows, { onConflict: 'evaluator_id,evaluatee_id,course_id' });
  return { error };
}

/** 교수자용: 강의 전체 발표평가 조회 */
async function jdy_getAllPitchEvalsForCourse(courseId) {
  const { data, error } = await sb
    .from('jdy_pitch_evaluations')
    .select(`
      *,
      evaluator:jdy_profiles!evaluator_id(full_name, student_id),
      evaluatee:jdy_profiles!evaluatee_id(full_name, student_id)
    `)
    .eq('course_id', courseId);
  if (error) { console.error('getAllPitchEvals:', error); return []; }
  return data || [];
}

/** 발표평가 총점 계산 */
function jdy_pitchTotal(ev) {
  return JDY_PITCH_CRITERIA.reduce((sum, c) => sum + (parseInt(ev[c.col]) || 0), 0);
}

// ============================================================
// 네비바 Auth 상태 토글 (공통)
// ============================================================

/**
 * 네비바의 nav-guest / nav-user 영역 표시/숨김
 * @param {boolean} isLoggedIn
 * @param {object|null} profile
 */
function jdy_toggleNavAuth(isLoggedIn, profile = null) {
  const guestEl = document.getElementById('nav-guest');
  const userEl  = document.getElementById('nav-user');
  if (guestEl) guestEl.style.display = isLoggedIn ? 'none' : 'flex';
  if (userEl)  userEl.style.display  = isLoggedIn ? 'flex'  : 'none';

  if (isLoggedIn && profile) {
    const avatarEl = document.getElementById('nav-avatar');
    const nameEl   = document.getElementById('nav-name');
    if (avatarEl) avatarEl.textContent = (profile.full_name || '?').charAt(0).toUpperCase();
    if (nameEl)   nameEl.textContent   = profile.full_name || '';
  }
}

// ============================================================
// 로그인 / 회원가입 공용 모달
// ============================================================

/**
 * 네비바 로그인·회원가입 버튼에서 호출하는 공용 OAuth 모달
 * @param {'login'|'signup'} mode
 */
function jdy_openAuthModal(mode = 'login') {
  const existing = document.getElementById('jdy-auth-popup');
  if (existing) { existing.remove(); return; }

  const isLogin = mode === 'login';
  const title   = isLogin ? '로그인' : '회원가입';
  const desc    = isLogin
    ? '소셜 계정으로 간편하게 로그인하세요.'
    : '계정을 만들고 발표평가에 참여하세요.<br>가입과 동시에 바로 이용 가능합니다.';

  const overlay = document.createElement('div');
  overlay.id        = 'jdy-auth-popup';
  overlay.className = 'jdy-modal-bg';
  overlay.innerHTML = `
    <div class="jdy-modal" style="max-width:380px;">
      <div class="jdy-modal-header">
        <span class="jdy-modal-title">${title}</span>
        <button class="jdy-modal-close" onclick="document.getElementById('jdy-auth-popup').remove()">✕</button>
      </div>
      <div class="jdy-modal-body" style="padding-bottom:28px;text-align:center;">
        <p style="font-size:.875rem;color:var(--text2);margin-bottom:24px;line-height:1.6">${desc}</p>

        <button class="jdy-btn jdy-btn-google jdy-btn-full" onclick="jdy_signInGoogle()">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
               alt="Google" style="width:20px;height:20px;">
          Google로 계속하기
        </button>

        <div class="jdy-auth-divider">또는</div>

        <button class="jdy-btn jdy-btn-kakao jdy-btn-full" onclick="jdy_signInKakao()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919" style="flex-shrink:0">
            <path d="M12 3C6.48 3 2 6.69 2 11.25c0 2.89 1.74 5.42 4.36 6.96l-1.11 4.09 4.73-3.12c.63.09 1.28.14 1.95.14 5.52 0 10-3.69 10-8.24C21.93 6.69 17.52 3 12 3z"/>
          </svg>
          카카오로 계속하기
        </button>

        <p style="font-size:.75rem;color:var(--text3);margin-top:20px;line-height:1.5;">
          로그인과 회원가입은 동일한 절차입니다.<br>
          처음 이용 시 자동으로 계정이 생성됩니다.
        </p>
      </div>
    </div>`;

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ============================================================
// 분반(Section) 지원 함수
// ============================================================

/**
 * 분반 코드로 해당 분반의 course_id를 찾아 수강신청
 * @param {string} section - 'Q1' | 'Q2' | 'Y2'
 */
async function jdy_enrollInSection(section) {
  const courses = await jdy_getCourses(true);
  const course  = courses.find(c => c.section === section);
  if (!course) return { error: `${section}반 강의를 찾을 수 없습니다. 교수자에게 문의하세요.` };
  return await jdy_enroll(course.id);
}

/**
 * 여러 강의의 수강생을 한 번에 조회 (분반 정보 포함)
 * @param {Array} courses - [{id, section, name}, ...]
 */
async function jdy_getMultiCourseStudents(courses) {
  const courseIds = courses.map(c => c.id);
  const { data, error } = await sb
    .from('jdy_enrollments')
    .select('course_id, student:jdy_profiles(id, full_name, student_id, email)')
    .in('course_id', courseIds);
  if (error) { console.error('getMultiCourseStudents:', error); return []; }

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c.section || c.name]));
  const seen = new Set();
  return (data || []).reduce((acc, row) => {
    const s = row.student;
    if (!s || seen.has(s.id)) return acc;
    seen.add(s.id);
    acc.push({ ...s, section: courseMap[row.course_id] || '-' });
    return acc;
  }, []);
}

/**
 * 여러 강의의 발표평가를 한 번에 조회
 * @param {string[]} courseIds
 */
async function jdy_getMultiCoursePitchEvals(courseIds) {
  if (!courseIds.length) return [];
  const { data, error } = await sb
    .from('jdy_pitch_evaluations')
    .select(`
      *,
      evaluator:jdy_profiles!evaluator_id(full_name, student_id),
      evaluatee:jdy_profiles!evaluatee_id(full_name, student_id)
    `)
    .in('course_id', courseIds);
  if (error) { console.error('getMultiCoursePitchEvals:', error); return []; }
  return data || [];
}

// ============================================================
// 분반 기반 헬퍼 함수 (index.html 단일 페이지용)
// ============================================================

/** 분반 코드로 활성 강의 1건 조회 */
async function jdy_getActiveCourseBySection(section) {
  const { data, error } = await sb
    .from('jdy_courses')
    .select('id,name,section,semester,year,description')
    .eq('section', section)
    .eq('is_active', true)
    .maybeSingle();
  if (error) { console.error('getActiveCourseBySection:', error); return null; }
  return data;
}

/** 분반 전체 멤버 조회 (jdy_profiles 직접, 수강신청 불필요)
 *  @param {string} section - 'Q1' | 'Q2' | 'Y2'
 *  @param {string|null} excludeId - 제외할 user id (보통 본인)
 */
async function jdy_getSectionMembers(section, excludeId = null) {
  let q = sb
    .from('jdy_profiles')
    .select('id,full_name,student_id')
    .eq('section', section)
    .or('role.neq.instructor,role.is.null')
    .order('student_id');
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q;
  if (error) { console.error('getSectionMembers:', error); return []; }
  return data || [];
}

/** 분반 전체 발표평가 집계용 조회 (evaluatee_id + 7개 점수만, 평가자 익명) */
async function jdy_getSectionAllPitchEvals(courseId) {
  const cols = ['evaluatee_id', ...JDY_PITCH_CRITERIA.map(c => c.col)].join(',');
  const { data, error } = await sb
    .from('jdy_pitch_evaluations')
    .select(cols)
    .eq('course_id', courseId);
  if (error) { console.error('getSectionAllPitchEvals:', error); return []; }
  return data || [];
}

// ============================================================
// UI Utilities
// ============================================================

function jdy_toast(type, msg) {
  const el = document.getElementById('jdy-toast');
  if (!el) { alert(msg); return; }
  el.className = `jdy-toast show ${type}`;
  el.textContent = msg;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 4000);
}

function jdy_loading(show) {
  const el = document.getElementById('jdy-loading');
  if (el) el.style.display = show ? 'flex' : 'none';
}

// ============================================================
// Helpers
// ============================================================

function jdy_fmtDate(str) {
  if (!str) return '-';
  return new Date(str).toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
}


