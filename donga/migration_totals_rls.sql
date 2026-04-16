-- ============================================================
-- 분반 합계 조회용 RLS 정책
-- 실행: Supabase Dashboard > SQL Editor
-- ============================================================

-- ① jdy_peer_evaluations: 본인 분반 강의의 평가 집계 조회 허용
DROP POLICY IF EXISTS "students can read section evals for totals" ON public.jdy_peer_evaluations;
CREATE POLICY "students can read section evals for totals"
ON public.jdy_peer_evaluations
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND course_id IN (
    SELECT course_id FROM public.jdy_enrollments
    WHERE student_id = auth.uid()
  )
);

-- ② jdy_profiles: 인증된 사용자 전체 허용 (분반 멤버 목록용)
--
-- ⚠️  RLS 무한재귀 주의: jdy_profiles 정책 안에서 jdy_profiles를 다시 SELECT하면 안 됩니다.
--
--   BAD (재귀):  EXISTS (SELECT 1 FROM jdy_profiles WHERE id = auth.uid() AND role = 'instructor')
--   BAD (재귀):  section = (SELECT section FROM jdy_profiles WHERE id = auth.uid())
--
--   GOOD: auth.role() = 'authenticated'  ← 재귀 없이 동작

-- 재귀 유발 정책 제거 (기존에 있던 버그 포함)
DROP POLICY IF EXISTS "section members can view each other" ON public.jdy_profiles;
DROP POLICY IF EXISTS "jdy_p_instructor_select" ON public.jdy_profiles;

-- 단순 정책으로 교체
DROP POLICY IF EXISTS "authenticated users can read profiles" ON public.jdy_profiles;
CREATE POLICY "authenticated users can read profiles"
ON public.jdy_profiles
FOR SELECT
USING (auth.role() = 'authenticated');

-- ③ jdy_profiles: 본인 프로필 INSERT/UPDATE 허용
--
-- ⚠️  cross-table 재귀 주의: jdy_enrollments.jdy_e_instructor_select 가 jdy_profiles를 참조하므로
--     jdy_p_classmate_select(jdy_enrollments 참조) 와 순환 발생 → jdy_e_instructor_select 제거 필요
DROP POLICY IF EXISTS "jdy_e_instructor_select" ON public.jdy_enrollments;

-- 본인 프로필 INSERT 허용
DROP POLICY IF EXISTS "users can insert own profile" ON public.jdy_profiles;
CREATE POLICY "users can insert own profile"
ON public.jdy_profiles
FOR INSERT
WITH CHECK (id = auth.uid());

-- 본인 프로필 UPDATE 허용
DROP POLICY IF EXISTS "users can update own profile" ON public.jdy_profiles;
CREATE POLICY "users can update own profile"
ON public.jdy_profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());
