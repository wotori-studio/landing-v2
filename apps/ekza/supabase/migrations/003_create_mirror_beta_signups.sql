-- Ekza Mirror beta waitlist and referral attribution.
-- The browser must never access this table directly: all writes go through the
-- ekza-mirror API route with the Supabase service role.
CREATE TABLE IF NOT EXISTS public.mirror_beta_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT NOT NULL DEFAULT 'hero',
  referral_code TEXT NOT NULL,
  referred_by_code TEXT,
  utm_source VARCHAR(200),
  utm_medium VARCHAR(200),
  utm_campaign VARCHAR(200),
  utm_term VARCHAR(200),
  utm_content VARCHAR(200),
  referrer_url VARCHAR(2048),
  consent_version VARCHAR(64) NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT mirror_beta_signups_email_key UNIQUE (email),
  CONSTRAINT mirror_beta_signups_referral_code_key UNIQUE (referral_code),
  CONSTRAINT mirror_beta_signups_email_normalized_check CHECK (
    email = LOWER(BTRIM(email))
    AND CHAR_LENGTH(email) BETWEEN 3 AND 254
    AND email !~ '[[:space:]]'
  ),
  CONSTRAINT mirror_beta_signups_status_check CHECK (
    status IN ('pending', 'invited', 'joined', 'unsubscribed')
  ),
  CONSTRAINT mirror_beta_signups_source_check CHECK (
    source IN ('hero', 'final_cta', 'header')
  ),
  CONSTRAINT mirror_beta_signups_referral_code_format_check CHECK (
    referral_code ~ '^[A-Za-z0-9_-]{16,64}$'
  ),
  CONSTRAINT mirror_beta_signups_not_self_referred_check CHECK (
    referred_by_code IS NULL OR referred_by_code <> referral_code
  ),
  CONSTRAINT mirror_beta_signups_referred_by_code_fkey
    FOREIGN KEY (referred_by_code)
    REFERENCES public.mirror_beta_signups (referral_code)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

-- Unique constraints already index email and referral_code. These two indexes
-- cover the remaining operational queries without duplicating those indexes.
CREATE INDEX IF NOT EXISTS mirror_beta_signups_status_created_at_idx
  ON public.mirror_beta_signups (status, created_at);

CREATE INDEX IF NOT EXISTS mirror_beta_signups_referred_by_code_idx
  ON public.mirror_beta_signups (referred_by_code)
  WHERE referred_by_code IS NOT NULL;

ALTER TABLE public.mirror_beta_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mirror_beta_signups FORCE ROW LEVEL SECURITY;

-- No RLS policies are intentionally created. service_role bypasses RLS; the
-- public API roles have neither a policy nor table privileges.
REVOKE ALL PRIVILEGES ON TABLE public.mirror_beta_signups FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.mirror_beta_signups FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.mirror_beta_signups FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.mirror_beta_signups TO service_role;

COMMENT ON TABLE public.mirror_beta_signups IS
  'Ekza Mirror beta registrations; accessible only through trusted server code.';
COMMENT ON COLUMN public.mirror_beta_signups.email IS
  'Trimmed, lowercase email used as the idempotency key.';
COMMENT ON COLUMN public.mirror_beta_signups.referral_code IS
  'Opaque deterministic code returned to this signup for sharing.';
COMMENT ON COLUMN public.mirror_beta_signups.referred_by_code IS
  'Validated referral code that brought this signup to the beta.';
COMMENT ON COLUMN public.mirror_beta_signups.consent_version IS
  'Version of the beta-invite and launch-news consent copy shown at signup.';
