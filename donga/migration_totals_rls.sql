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
-- ⚠️  주의: 아래처럼 jdy_profiles 안에서 jdy_profiles를 다시 조회하면
--           RLS 정책 무한재귀가 발생합니다 (infinite recursion in policy).
--
--   BAD:  section = (SELECT section FROM public.jdy_profiles WHERE id = auth.uid())
--
--   → 단순하게 auth.role() = 'authenticated' 로 허용하면 재귀 없이 동작합니다.
--     (학생이 동료 이름/학번을 볼 수 있어야 하므로 이 정책이 맞습니다)

DROP POLICY IF EXISTS "section members can view each other" ON public.jdy_profiles;
DROP POLICY IF EXISTS "authenticated users can read profiles" ON public.jdy_profiles;

CREATE POLICY "authenticated users can read profiles"
ON public.jdy_profiles
FOR SELECT
USING (auth.role() = 'authenticated');
