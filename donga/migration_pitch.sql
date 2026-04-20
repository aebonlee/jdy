-- ============================================================
-- 발표평가 시스템 Migration
-- schema.sql 실행 후 추가 실행하세요
-- ============================================================

-- 1. 발표평가 테이블
CREATE TABLE IF NOT EXISTS public.jdy_pitch_evaluations (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluator_id             UUID        NOT NULL REFERENCES public.jdy_profiles(id) ON DELETE CASCADE,
  evaluatee_id             UUID        NOT NULL REFERENCES public.jdy_profiles(id) ON DELETE CASCADE,
  course_id                UUID        NOT NULL REFERENCES public.jdy_courses(id)  ON DELETE CASCADE,
  score_self_understanding SMALLINT    CHECK (score_self_understanding BETWEEN 0 AND 20), -- 자기이해+적성 (20점)
  score_startup_item       SMALLINT    CHECK (score_startup_item       BETWEEN 0 AND 15), -- 창업아이템 (15점)
  score_macro_env          SMALLINT    CHECK (score_macro_env          BETWEEN 0 AND 15), -- 거시환경 (15점)
  score_customer_market    SMALLINT    CHECK (score_customer_market    BETWEEN 0 AND 10), -- 고객/시장 (10점)
  score_revenue            SMALLINT    CHECK (score_revenue            BETWEEN 0 AND 15), -- 수익구조 (15점)
  score_execution          SMALLINT    CHECK (score_execution          BETWEEN 0 AND 15), -- 실행준비 (15점)
  score_support_strategy   SMALLINT    CHECK (score_support_strategy   BETWEEN 0 AND 10), -- 지원전략 (10점)
  submitted_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_pitch_eval CHECK (evaluator_id <> evaluatee_id),
  UNIQUE(evaluator_id, evaluatee_id, course_id)
);

-- 2. updated_at 트리거
CREATE TRIGGER jdy_pitch_evaluations_updated_at
  BEFORE UPDATE ON public.jdy_pitch_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.jdy_set_updated_at();

-- 3. RLS 활성화
ALTER TABLE public.jdy_pitch_evaluations ENABLE ROW LEVEL SECURITY;

-- 본인이 작성한 평가 조회
DROP POLICY IF EXISTS "jdy_pe_self_select" ON public.jdy_pitch_evaluations;
CREATE POLICY "jdy_pe_self_select" ON public.jdy_pitch_evaluations
  FOR SELECT USING (evaluator_id = auth.uid());

-- 같은 수업 동료 평가 제출 (자기 자신 제외)
DROP POLICY IF EXISTS "jdy_pe_self_insert" ON public.jdy_pitch_evaluations;
CREATE POLICY "jdy_pe_self_insert" ON public.jdy_pitch_evaluations
  FOR INSERT WITH CHECK (
    evaluator_id = auth.uid()
    AND evaluator_id <> evaluatee_id
    AND EXISTS (
      SELECT 1 FROM public.jdy_enrollments e1
      JOIN   public.jdy_enrollments e2 ON e1.course_id = e2.course_id
      WHERE  e1.student_id = auth.uid()
      AND    e2.student_id = jdy_pitch_evaluations.evaluatee_id
      AND    e1.course_id  = jdy_pitch_evaluations.course_id
    )
  );

-- 본인 작성 평가 수정
DROP POLICY IF EXISTS "jdy_pe_self_update" ON public.jdy_pitch_evaluations;
CREATE POLICY "jdy_pe_self_update" ON public.jdy_pitch_evaluations
  FOR UPDATE USING (evaluator_id = auth.uid());

-- 교수자: 전체 조회
DROP POLICY IF EXISTS "jdy_pe_instructor_select" ON public.jdy_pitch_evaluations;
CREATE POLICY "jdy_pe_instructor_select" ON public.jdy_pitch_evaluations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.jdy_profiles WHERE id = auth.uid() AND role = 'instructor')
  );
