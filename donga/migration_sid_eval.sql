-- ============================================================
-- 발표평가: evaluatee를 학번(student_id) 기준으로 변경
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. evaluatee_sid 컬럼 추가
ALTER TABLE public.jdy_pitch_evaluations
  ADD COLUMN IF NOT EXISTS evaluatee_sid TEXT;

-- 2. 기존 데이터가 있으면 evaluatee_id → evaluatee_sid 매핑
UPDATE public.jdy_pitch_evaluations pe
SET evaluatee_sid = p.student_id
FROM public.jdy_profiles p
WHERE pe.evaluatee_id = p.id
  AND pe.evaluatee_sid IS NULL;

-- 3. evaluatee_id FK 제약 해제 (nullable로 변경)
ALTER TABLE public.jdy_pitch_evaluations
  ALTER COLUMN evaluatee_id DROP NOT NULL;

-- 4. evaluatee_id 기본값 설정 (NULL 허용)
ALTER TABLE public.jdy_pitch_evaluations
  ALTER COLUMN evaluatee_id SET DEFAULT NULL;

-- 5. 기존 unique constraint 삭제 후 새로 생성 (evaluatee_sid 기준)
DO $$
BEGIN
  DROP INDEX IF EXISTS jdy_pitch_evaluations_evaluator_id_evaluatee_id_course_id_key;
  ALTER TABLE public.jdy_pitch_evaluations
    DROP CONSTRAINT IF EXISTS jdy_pitch_evaluations_evaluator_id_evaluatee_id_course_id_key;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 6. 새 unique index (evaluatee_sid 기준, upsert용)
CREATE UNIQUE INDEX IF NOT EXISTS jdy_pitch_eval_unique_sid
  ON public.jdy_pitch_evaluations (evaluator_id, evaluatee_sid, course_id);

-- 7. RLS INSERT 정책: evaluatee_id 없이도 삽입 가능하도록
-- 기존 INSERT 정책 삭제 후 재생성 (evaluatee_id 체크 제거)
DO $$
BEGIN
  -- 기존 정책 삭제 시도
  DROP POLICY IF EXISTS "Students can insert own evals" ON public.jdy_pitch_evaluations;
  DROP POLICY IF EXISTS "insert_own_eval" ON public.jdy_pitch_evaluations;
  DROP POLICY IF EXISTS "jdy_pitch_evaluations_insert_policy" ON public.jdy_pitch_evaluations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- INSERT: 본인의 evaluator_id로만 삽입 가능
CREATE POLICY "pitch_eval_insert"
  ON public.jdy_pitch_evaluations
  FOR INSERT
  WITH CHECK (auth.uid() = evaluator_id);

-- SELECT: 본인이 작성한 평가만 조회 (학생), 교수자는 전체
DO $$
BEGIN
  DROP POLICY IF EXISTS "Students can read own evals" ON public.jdy_pitch_evaluations;
  DROP POLICY IF EXISTS "select_own_eval" ON public.jdy_pitch_evaluations;
  DROP POLICY IF EXISTS "jdy_pitch_evaluations_select_policy" ON public.jdy_pitch_evaluations;
  DROP POLICY IF EXISTS "Instructors can read all evals" ON public.jdy_pitch_evaluations;
  DROP POLICY IF EXISTS "pitch_eval_select" ON public.jdy_pitch_evaluations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "pitch_eval_select"
  ON public.jdy_pitch_evaluations
  FOR SELECT
  USING (
    auth.uid() = evaluator_id
    OR EXISTS (
      SELECT 1 FROM public.jdy_profiles
      WHERE id = auth.uid() AND role = 'instructor'
    )
  );

-- UPDATE: 본인이 작성한 평가만 수정 가능
DO $$
BEGIN
  DROP POLICY IF EXISTS "Students can update own evals" ON public.jdy_pitch_evaluations;
  DROP POLICY IF EXISTS "update_own_eval" ON public.jdy_pitch_evaluations;
  DROP POLICY IF EXISTS "pitch_eval_update" ON public.jdy_pitch_evaluations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "pitch_eval_update"
  ON public.jdy_pitch_evaluations
  FOR UPDATE
  USING (auth.uid() = evaluator_id);

-- 8. RLS 활성화 확인
ALTER TABLE public.jdy_pitch_evaluations ENABLE ROW LEVEL SECURITY;
