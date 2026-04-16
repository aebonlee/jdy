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
