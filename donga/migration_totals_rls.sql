-- ============================================================
-- 분반 합계 조회용 RLS 정책 추가
-- 실행: Supabase Dashboard > SQL Editor 에서 실행
-- ============================================================

-- 1) 인증된 학생이 자신의 분반 강의에 대한 전체 평가(익명 집계) 조회 허용
CREATE POLICY IF NOT EXISTS "students can read section evals for totals"
ON public.jdy_peer_evaluations
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND course_id IN (
    SELECT course_id FROM public.jdy_enrollments
    WHERE student_id = auth.uid()
  )
);

-- 2) 학생이 같은 분반 프로필 조회 허용 (분반 멤버 목록용)
CREATE POLICY IF NOT EXISTS "section members can view each other"
ON public.jdy_profiles
FOR SELECT
USING (
  auth.uid() = id
  OR (
    auth.role() = 'authenticated'
    AND section = (SELECT section FROM public.jdy_profiles WHERE id = auth.uid())
  )
);
