-- ============================================================
-- 교수자 추가: careerdima@gmail.com (김성길)
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. 이미 프로필이 있으면 role을 instructor로 업데이트
UPDATE public.jdy_profiles
SET role = 'instructor', full_name = '김성길'
WHERE email = 'careerdima@gmail.com';

-- 2. 프로필이 없으면 (아직 로그인한 적 없는 경우)
-- → 해당 계정으로 먼저 한 번 로그인해야 auth.users에 등록됩니다.
-- → 로그인 후 위 UPDATE를 다시 실행하세요.
