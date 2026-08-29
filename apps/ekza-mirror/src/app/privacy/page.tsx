import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { Noise } from "@/components/noise";

export const metadata: Metadata = {
  title: "Beta privacy | Ekza Mirror",
  description:
    "How Ekza Mirror uses email addresses submitted for beta access and launch updates.",
};

const CONTACT_EMAIL = "wotorimovako@gmail.com";

export default function PrivacyPage() {
  return (
    <div className="mir-mesh relative min-h-screen overflow-x-clip">
      <Noise className="hidden lg:block" fixed />
      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="/" aria-label="Ekza Mirror home">
            <Logo variant="full" />
          </a>
          <a
            href="/"
            className="flex min-h-11 items-center font-display text-sm text-mirror-silver transition hover:text-mirror-chrome"
          >
            Back to Mirror
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="mir-kicker text-mirror-acid">beta email privacy</p>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-[-0.03em] text-mirror-chrome sm:text-5xl">
          A short, human privacy note.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-mirror-silver sm:text-lg">
          This note covers the Ekza Mirror beta list. It explains what we
          collect when you leave an email and how to get it removed.
        </p>

        <div className="mt-12 grid gap-4">
          <PrivacyBlock title="What we collect">
            Your email address, where the form appeared on this site, referral
            or campaign parameters in the link, and the page that referred you.
            We also create an opaque referral code so you can invite a test
            partner.
          </PrivacyBlock>
          <PrivacyBlock title="Why we use it">
            To manage beta invitations, send essential Ekza Mirror beta and App
            Store release updates, understand which launch campaigns work, and
            prevent repeated or automated form submissions.
          </PrivacyBlock>
          <PrivacyBlock title="Where it is processed">
            The site runs on Vercel and beta records are stored in Supabase. We
            do not sell the beta list. Access is limited to the team operating
            Ekza Mirror and the services needed to run the site and database.
          </PrivacyBlock>
          <PrivacyBlock title="Analytics and abuse prevention">
            Page analytics use a random browser identifier and coarse request
            location where the hosting platform provides it. The signup endpoint
            uses an IP address briefly for rate limiting; it is not saved with
            your beta record.
          </PrivacyBlock>
          <PrivacyBlock title="Your choices">
            You can unsubscribe from any email or ask us to delete your beta
            record at any time. We keep the record while the beta and launch
            communication is active, unless you ask us to remove it sooner.
          </PrivacyBlock>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-sm leading-relaxed text-mirror-silver">
          <p>
            Questions or deletion requests:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-mirror-chrome underline decoration-mirror-acid/60 underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-3 text-xs text-mirror-silver/65">
            Last updated: 29 August 2026
          </p>
        </div>
      </main>
    </div>
  );
}

function PrivacyBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mir-glass p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-mirror-chrome">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-mirror-silver sm:text-base">
        {children}
      </p>
    </section>
  );
}
