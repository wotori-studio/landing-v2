import { Reveal } from "@/components/motion";

const FAQ_CSS = `
.mir-faq summary { list-style: none; cursor: pointer; }
.mir-faq summary::-webkit-details-marker { display: none; }
.mir-faq__panel { animation: mir-faq-in 340ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes mir-faq-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .mir-faq__panel { animation: none; }
}
`;

const QA = [
  {
    q: "Do I need a special phone?",
    a: "An iPhone with an A12 Bionic chip or newer, running iOS 17 or later. Body tracking uses the rear camera, and the simulator will not do — it has to be a real device. No Android, no iPad-only tricks, no desktop.",
  },
  {
    q: "Where do the avatars come from?",
    a: "The Ekza avatar catalog. Each one is a VRM or USDZ file with provenance and a SHA-256 you can verify, resolved by a small service that returns the descriptor. Six verified avatars live on devnet today. The build ships a procedural volumetric avatar now; the real rigged characters are the next milestone.",
  },
  {
    q: "Does my video get uploaded anywhere?",
    a: "No. Tracking and rendering both run on the iPhone. Camera frames never leave the device — no cloud vision, no external ML service, nothing waiting on a server. What you record stays on your phone until you choose to share it.",
  },
  {
    q: "Can I use my own avatar?",
    a: "Not yet. Today you pick from the catalog. The resolver already reads descriptors and provenance, and it tells you honestly when an avatar has no iOS-ready rendition. Bring-your-own arrives with the VRM to USDZ retarget.",
  },
  {
    q: "Is this the same as an Instagram filter?",
    a: "No. A filter paints a texture on a face in 2D. Mirror uses ARKit body tracking to build a 3D skeleton of a whole person, then RealityKit draws a volumetric avatar onto it in the room. And the avatar is an owned asset with a lineage, not a sticker. One honest caveat: it covers the person, it does not rebuild the background behind them.",
  },
];

export function SectionFaq() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-mirror-chrome/10 bg-mirror-void py-24 sm:py-32"
    >
      <style dangerouslySetInnerHTML={{ __html: FAQ_CSS }} />
      <div
        className="mir-grain pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal as="p" className="mir-kicker">
            straight answers
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold tracking-[-0.02em] text-mirror-chrome sm:text-4xl md:text-5xl"
          >
            Ask the awkward <span className="mir-grad">questions</span>.
          </Reveal>
        </div>

        <div className="mir-faq mt-12 space-y-3">
          {QA.map((item, i) => (
            <Reveal key={item.q} delay={i * 70}>
              <details className="mir-glass mir-glass-hover open:bg-white/[0.06]">
                <summary className="flex items-start gap-4 px-5 py-5 sm:px-7">
                  <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center">
                    <span
                      aria-hidden="true"
                      className="relative block h-[15px] w-[15px] transition-transform duration-300 [[open]_&]:rotate-45"
                    >
                      <span className="bg-prism absolute left-0 top-[7px] h-px w-[15px]" />
                      <span className="bg-prism absolute left-[7px] top-0 h-[15px] w-px" />
                    </span>
                  </span>
                  <h3 className="font-display text-base font-semibold leading-snug text-mirror-chrome sm:text-lg">
                    {item.q}
                  </h3>
                </summary>
                <div className="mir-faq__panel px-5 pb-6 pl-14 sm:px-7 sm:pb-7 sm:pl-16">
                  <p className="text-sm leading-relaxed text-mirror-silver sm:text-[0.95rem]">
                    {item.a}
                  </p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal
          as="p"
          delay={420}
          className="mt-10 text-sm text-mirror-silver/70"
        >
          Still curious? Ask in Discord — the prototype gets shown there first.
        </Reveal>
      </div>
    </section>
  );
}
