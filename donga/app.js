'use strict';

// ============================================================
// 동아방송대 동료평가 시스템 - 공유 유틸리티
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

// ============================================================
// Peer Evaluations
// ============================================================

async function jdy_getClassmates(courseId, myId) {
  const { data, error } = await sb
    .from('jdy_enrollments')
    .select('student:jdy_profiles(id, full_name, student_id)')
    .eq('course_id', courseId)
    .neq('student_id', myId);
  if (error) { console.error('getClassmates:', error); return []; }
  return (data || []).map(r => r.student).filter(Boolean);
}

async function jdy_getMyEvals(courseId, myId) {
  const { data, error } = await sb
    .from('jdy_peer_evaluations')
    .select('*')
    .eq('course_id', courseId)
    .eq('evaluator_id', myId);
  if (error) { console.error('getMyEvals:', error); return []; }
  return data || [];
}

async function jdy_submitEval(payload) {
  // payload: { evaluatee_id, course_id, score_*, comment }
  const session = await jdy_getSession();
  if (!session) return { error: '로그인이 필요합니다.' };

  const body = { ...payload, evaluator_id: session.user.id };
  const { error } = await sb
    .from('jdy_peer_evaluations')
    .upsert(body, { onConflict: 'evaluator_id,evaluatee_id,course_id' });
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

async function jdy_getAllEvalsForCourse(courseId) {
  const { data, error } = await sb
    .from('jdy_peer_evaluations')
    .select(`
      *,
      evaluator:jdy_profiles!evaluator_id(full_name),
      evaluatee:jdy_profiles!evaluatee_id(full_name, student_id)
    `)
    .eq('course_id', courseId);
  if (error) { console.error('getAllEvals:', error); return []; }
  return data || [];
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
    : '계정을 만들고 동료평가에 참여하세요.<br>가입과 동시에 바로 이용 가능합니다.';

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
// Star Rating (JavaScript 기반)
// ============================================================

/**
 * 별점 입력 위젯 HTML 문자열 반환
 * @param {string} name  - input name 속성
 * @param {string} label - 표시 레이블
 * @param {number} value - 초기값 (0 = 미선택)
 */
function jdy_starRatingHTML(name, label, value = 0) {
  const stars = [1, 2, 3, 4, 5].map(i => `
    <span class="jdy-star${i <= value ? ' on' : ''}" data-v="${i}" role="button" tabindex="0" aria-label="${i}점">★</span>
  `).join('');
  return `
    <div class="jdy-rating-row">
      <span class="jdy-rating-label">${label}</span>
      <div class="jdy-stars" data-name="${name}" role="radiogroup" aria-label="${label}">
        ${stars}
        <input type="hidden" name="${name}" value="${value}" data-req>
      </div>
    </div>`;
}

/**
 * 별점 위젯 이벤트 바인딩 (DOM 삽입 후 호출)
 */
function jdy_bindStars(container) {
  container.querySelectorAll('.jdy-stars').forEach(group => {
    const stars  = group.querySelectorAll('.jdy-star');
    const hidden = group.querySelector('input[type="hidden"]');

    const paint = val => stars.forEach(s => s.classList.toggle('on', +s.dataset.v <= val));

    stars.forEach(star => {
      star.addEventListener('mouseover', () => paint(+star.dataset.v));
      star.addEventListener('mouseout',  () => paint(+(hidden.value || 0)));
      star.addEventListener('click', () => {
        hidden.value = star.dataset.v;
        paint(+star.dataset.v);
      });
      star.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { star.click(); e.preventDefault(); }
      });
    });
  });
}

// ============================================================
// Helpers
// ============================================================

function jdy_avg(ev) {
  const fields = ['score_participation','score_responsibility',
                  'score_cooperation','score_communication','score_contribution'];
  const vals = fields.map(f => ev[f]).filter(v => v != null);
  return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '-';
}

function jdy_fmtDate(str) {
  if (!str) return '-';
  return new Date(str).toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
}

function jdy_scoreBar(val, max = 5) {
  const pct = Math.round((val / max) * 100);
  const color = val >= 4 ? '#22c55e' : val >= 3 ? '#f59e0b' : '#ef4444';
  return `<div class="jdy-bar-wrap"><div class="jdy-bar" style="width:${pct}%;background:${color}"></div><span>${val}</span></div>`;
}
