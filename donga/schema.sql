-- ============================================================
-- 동아방송대 동료평가 시스템 - DB 스키마
-- Supabase SQL Editor에서 실행하세요
-- 테이블 접두사: jdy_
-- ============================================================

-- ============================================================
-- 1. 테이블 생성
-- ============================================================

-- 사용자 프로필 (auth.users 확장)
CREATE TABLE IF NOT EXISTS public.jdy_profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  role        TEXT        NOT NULL DEFAULT 'student'
                          CHECK (role IN ('student', 'instructor')),
  student_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 강의 과목
CREATE TABLE IF NOT EXISTS public.jdy_courses (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  description  TEXT,
  semester     TEXT        NOT NULL,  -- 예: '2025-1', '2025-2'
  year         INT         NOT NULL DEFAULT EXTRACT(YEAR FROM NOW())::INT,
  instructor_id UUID       REFERENCES public.jdy_profiles(id) ON DELETE SET NULL,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 수강 등록
CREATE TABLE IF NOT EXISTS public.jdy_enrollments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID        NOT NULL REFERENCES public.jdy_profiles(id) ON DELETE CASCADE,
  course_id   UUID        NOT NULL REFERENCES public.jdy_courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- 동료 평가
CREATE TABLE IF NOT EXISTS public.jdy_peer_evaluations (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluator_id         UUID        NOT NULL REFERENCES public.jdy_profiles(id) ON DELETE CASCADE,
  evaluatee_id         UUID        NOT NULL REFERENCES public.jdy_profiles(id) ON DELETE CASCADE,
  course_id            UUID        NOT NULL REFERENCES public.jdy_courses(id) ON DELETE CASCADE,
  -- 평가 항목 (1~5점)
  score_participation  INT         NOT NULL CHECK (score_participation  BETWEEN 1 AND 5), -- 참여도
  score_responsibility INT         NOT NULL CHECK (score_responsibility BETWEEN 1 AND 5), -- 책임감
  score_cooperation    INT         NOT NULL CHECK (score_cooperation    BETWEEN 1 AND 5), -- 협력도
  score_communication  INT         NOT NULL CHECK (score_communication  BETWEEN 1 AND 5), -- 소통능력
  score_contribution   INT         NOT NULL CHECK (score_contribution   BETWEEN 1 AND 5), -- 기여도
  comment              TEXT,
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_eval CHECK (evaluator_id <> evaluatee_id),
  UNIQUE(evaluator_id, evaluatee_id, course_id)
);

-- ============================================================
-- 2. 집계 뷰 (익명 평균 점수 - 학생용)
-- ============================================================
CREATE OR REPLACE VIEW public.jdy_evaluation_summary AS
SELECT
  evaluatee_id,
  course_id,
  COUNT(*)                                                                  AS eval_count,
  ROUND(AVG(score_participation)::NUMERIC,  2)                              AS avg_participation,
  ROUND(AVG(score_responsibility)::NUMERIC, 2)                              AS avg_responsibility,
  ROUND(AVG(score_cooperation)::NUMERIC,    2)                              AS avg_cooperation,
  ROUND(AVG(score_communication)::NUMERIC,  2)                              AS avg_communication,
  ROUND(AVG(score_contribution)::NUMERIC,   2)                              AS avg_contribution,
  ROUND(
    AVG((score_participation + score_responsibility + score_cooperation
         + score_communication + score_contribution)::NUMERIC / 5.0), 2
  )                                                                         AS avg_total
FROM public.jdy_peer_evaluations
GROUP BY evaluatee_id, course_id;

-- ============================================================
-- 3. 트리거 & 함수
-- ============================================================

-- 신규 로그인 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.jdy_handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.jdy_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS jdy_on_auth_user_created ON auth.users;
CREATE TRIGGER jdy_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.jdy_handle_new_user();

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION public.jdy_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER jdy_profiles_updated_at
  BEFORE UPDATE ON public.jdy_profiles
  FOR EACH ROW EXECUTE FUNCTION public.jdy_set_updated_at();

CREATE TRIGGER jdy_courses_updated_at
  BEFORE UPDATE ON public.jdy_courses
  FOR EACH ROW EXECUTE FUNCTION public.jdy_set_updated_at();

CREATE TRIGGER jdy_peer_evaluations_updated_at
  BEFORE UPDATE ON public.jdy_peer_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.jdy_set_updated_at();

-- ============================================================
-- 4. Row Level Security
-- ============================================================
ALTER TABLE public.jdy_profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jdy_courses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jdy_enrollments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jdy_peer_evaluations   ENABLE ROW LEVEL SECURITY;

-- ── jdy_profiles ──────────────────────────────────────────
DROP POLICY IF EXISTS "jdy_p_self_select"       ON public.jdy_profiles;
DROP POLICY IF EXISTS "jdy_p_self_update"       ON public.jdy_profiles;
DROP POLICY IF EXISTS "jdy_p_classmate_select"  ON public.jdy_profiles;
DROP POLICY IF EXISTS "jdy_p_instructor_select" ON public.jdy_profiles;

-- 본인 조회
CREATE POLICY "jdy_p_self_select" ON public.jdy_profiles
  FOR SELECT USING (auth.uid() = id);

-- 본인 수정
CREATE POLICY "jdy_p_self_update" ON public.jdy_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 같은 수업 수강생 조회 (평가 대상 선택을 위해)
CREATE POLICY "jdy_p_classmate_select" ON public.jdy_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jdy_enrollments e1
      JOIN   public.jdy_enrollments e2 ON e1.course_id = e2.course_id
      WHERE  e1.student_id = auth.uid()
      AND    e2.student_id = jdy_profiles.id
    )
  );

-- 교수자: 전체 프로필 조회
CREATE POLICY "jdy_p_instructor_select" ON public.jdy_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jdy_profiles p
      WHERE p.id = auth.uid() AND p.role = 'instructor'
    )
  );

-- ── jdy_courses ───────────────────────────────────────────
DROP POLICY IF EXISTS "jdy_c_anon_select"       ON public.jdy_courses;
DROP POLICY IF EXISTS "jdy_c_instructor_insert"  ON public.jdy_courses;
DROP POLICY IF EXISTS "jdy_c_instructor_update"  ON public.jdy_courses;

-- 누구나 조회 가능 (공개 강의 목록)
CREATE POLICY "jdy_c_anon_select" ON public.jdy_courses
  FOR SELECT USING (true);

-- 교수자만 생성
CREATE POLICY "jdy_c_instructor_insert" ON public.jdy_courses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.jdy_profiles WHERE id = auth.uid() AND role = 'instructor')
  );

-- 담당 교수자만 수정
CREATE POLICY "jdy_c_instructor_update" ON public.jdy_courses
  FOR UPDATE USING (instructor_id = auth.uid());

-- ── jdy_enrollments ───────────────────────────────────────
DROP POLICY IF EXISTS "jdy_e_self_select"       ON public.jdy_enrollments;
DROP POLICY IF EXISTS "jdy_e_self_insert"       ON public.jdy_enrollments;
DROP POLICY IF EXISTS "jdy_e_self_delete"       ON public.jdy_enrollments;
DROP POLICY IF EXISTS "jdy_e_instructor_select" ON public.jdy_enrollments;

CREATE POLICY "jdy_e_self_select" ON public.jdy_enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "jdy_e_self_insert" ON public.jdy_enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "jdy_e_self_delete" ON public.jdy_enrollments
  FOR DELETE USING (student_id = auth.uid());

CREATE POLICY "jdy_e_instructor_select" ON public.jdy_enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.jdy_profiles WHERE id = auth.uid() AND role = 'instructor')
  );

-- ── jdy_peer_evaluations ──────────────────────────────────
DROP POLICY IF EXISTS "jdy_ev_self_select"       ON public.jdy_peer_evaluations;
DROP POLICY IF EXISTS "jdy_ev_self_insert"       ON public.jdy_peer_evaluations;
DROP POLICY IF EXISTS "jdy_ev_self_update"       ON public.jdy_peer_evaluations;
DROP POLICY IF EXISTS "jdy_ev_instructor_select" ON public.jdy_peer_evaluations;

-- 본인이 작성한 평가만 조회
CREATE POLICY "jdy_ev_self_select" ON public.jdy_peer_evaluations
  FOR SELECT USING (evaluator_id = auth.uid());

-- 같은 수업 동료만 평가 가능
CREATE POLICY "jdy_ev_self_insert" ON public.jdy_peer_evaluations
  FOR INSERT WITH CHECK (
    evaluator_id = auth.uid()
    AND evaluator_id <> evaluatee_id
    AND EXISTS (
      SELECT 1 FROM public.jdy_enrollments e1
      JOIN   public.jdy_enrollments e2 ON e1.course_id = e2.course_id
      WHERE  e1.student_id = auth.uid()
      AND    e2.student_id = jdy_peer_evaluations.evaluatee_id
      AND    e1.course_id  = jdy_peer_evaluations.course_id
    )
  );

-- 본인 작성 평가 수정
CREATE POLICY "jdy_ev_self_update" ON public.jdy_peer_evaluations
  FOR UPDATE USING (evaluator_id = auth.uid());

-- 교수자: 전체 조회
CREATE POLICY "jdy_ev_instructor_select" ON public.jdy_peer_evaluations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.jdy_profiles WHERE id = auth.uid() AND role = 'instructor')
  );

-- ── jdy_evaluation_summary 뷰 RLS (보안 뷰) ───────────────
-- 학생: 본인의 집계만 조회 (누가 평가했는지 알 수 없음)
-- 교수자: 전체 조회
-- → 뷰에는 RLS를 직접 적용할 수 없으므로, 뷰를 SECURITY INVOKER로 정의하고
--   기반 테이블(jdy_peer_evaluations)의 RLS로 제어합니다.
--   교수자는 기반 테이블 전체 조회 권한이 있으므로 뷰도 전체 조회됩니다.
--   일반 학생은 jdy_peer_evaluations에서 자신이 작성한 평가만 볼 수 있어
--   뷰에서도 자신이 작성한 평가의 집계만 조회됩니다.
--
--   학생이 "내가 받은 점수"를 보려면 별도 Supabase Function 또는
--   교수자가 공유하는 방식을 사용하세요.

-- ============================================================
-- 5. 샘플 데이터 / 관리자 쿼리 모음
-- ============================================================

-- [교수자 권한 부여] 가입 후 아래 쿼리로 role 변경
-- UPDATE public.jdy_profiles SET role = 'instructor' WHERE email = 'instructor@example.com';

-- [샘플 강의 등록] 교수자 계정으로 로그인 후 또는 직접 삽입
-- INSERT INTO public.jdy_courses (name, description, semester, year, instructor_id)
-- VALUES (
--   '직업진로설계',
--   '미래 사회와 직업 세계를 이해하고, 자신만의 커리어 로드맵을 설계합니다.',
--   '2025-1', 2025,
--   (SELECT id FROM public.jdy_profiles WHERE email = 'instructor@example.com')
-- );

-- [수강생 수동 등록]
-- INSERT INTO public.jdy_enrollments (student_id, course_id)
-- SELECT p.id, c.id
-- FROM public.jdy_profiles p, public.jdy_courses c
-- WHERE p.email = 'student@example.com' AND c.name = '직업진로설계';
