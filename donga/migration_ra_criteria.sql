-- RA(진로독서 a반) 전용 평가 항목 컬럼 추가
-- 완성도(10점), 확장성(10점), 전달력(10점) → 총 30점

ALTER TABLE public.jdy_pitch_evaluations
  ADD COLUMN IF NOT EXISTS score_completion    SMALLINT CHECK (score_completion    BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS score_scalability   SMALLINT CHECK (score_scalability   BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS score_communication SMALLINT CHECK (score_communication BETWEEN 0 AND 10);
