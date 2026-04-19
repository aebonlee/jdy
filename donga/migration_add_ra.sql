-- ============================================================
-- 진로독서 a반 (RA) 섹션 추가
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. jdy_courses 테이블의 section CHECK 제약 업데이트
ALTER TABLE public.jdy_courses DROP CONSTRAINT IF EXISTS jdy_courses_section_check;
ALTER TABLE public.jdy_courses
  ADD CONSTRAINT jdy_courses_section_check
  CHECK (section IN ('Q1','Q2','Y2','RA'));

-- 2. jdy_profiles 테이블의 section CHECK 제약 업데이트
ALTER TABLE public.jdy_profiles DROP CONSTRAINT IF EXISTS jdy_profiles_section_check;
ALTER TABLE public.jdy_profiles
  ADD CONSTRAINT jdy_profiles_section_check
  CHECK (section IN ('Q1','Q2','Y2','RA'));

-- 3. 진로독서 a반 강의 등록
-- ⚠️ instructor_id를 교수자(radica8566@gmail.com)의 UUID로 교체
-- 아래 쿼리로 UUID 확인:
--   SELECT id FROM public.jdy_profiles WHERE email = 'radica8566@gmail.com';
INSERT INTO public.jdy_courses (name, description, semester, year, section, instructor_id, is_active)
SELECT
  '진로독서 a반',
  '2026학년도 1학기 진로독서 (a반)',
  '2026-1',
  2026,
  'RA',
  id,
  true
FROM public.jdy_profiles
WHERE email = 'radica8566@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.jdy_courses WHERE section = 'RA' AND is_active = true
  );
