-- ============================================================
-- 3개 분반(Q1, Q2, Y2) 지원을 위한 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 1. jdy_courses에 section 컬럼 추가
ALTER TABLE public.jdy_courses
  ADD COLUMN IF NOT EXISTS section TEXT
  CHECK (section IN ('Q1','Q2','Y2'));

-- 2. jdy_profiles에 section 캐시 컬럼 추가 (빠른 조회용)
ALTER TABLE public.jdy_profiles
  ADD COLUMN IF NOT EXISTS section TEXT
  CHECK (section IN ('Q1','Q2','Y2'));

-- ============================================================
-- 3. 강의 등록 예시 (교수자 계정 id로 instructor_id 대입)
--    SQL Editor에서 교수자 id 확인: SELECT id FROM jdy_profiles WHERE role='instructor';
-- ============================================================

-- INSERT INTO public.jdy_courses (name, description, semester, year, section, instructor_id, is_active)
-- VALUES
--   ('창업진로설계 Q1', '미래 직업세계와 창업 전략을 탐색합니다. (Q1반)', '2026-1', 2026, 'Q1',
--    '여기에-교수자-UUID-입력', true),
--   ('창업진로설계 Q2', '미래 직업세계와 창업 전략을 탐색합니다. (Q2반)', '2026-1', 2026, 'Q2',
--    '여기에-교수자-UUID-입력', true),
--   ('창업진로설계 Y2', '미래 직업세계와 창업 전략을 탐색합니다. (Y2반)', '2026-1', 2026, 'Y2',
--    '여기에-교수자-UUID-입력', true);

-- ============================================================
-- 4. RLS: 교수자는 전체 분반 프로필 조회 가능 (기존 policy 유지)
--    학생도 분반 내 동료 프로필 조회 가능 (기존 jdy_p_classmate_select 유지)
-- ============================================================

-- 5. 교수자 학생 section 수동 업데이트 (필요 시)
-- UPDATE public.jdy_profiles SET section = 'Q1'
-- WHERE id IN (SELECT student_id FROM jdy_enrollments
--              JOIN jdy_courses ON jdy_enrollments.course_id = jdy_courses.id
--              WHERE jdy_courses.section = 'Q1');
