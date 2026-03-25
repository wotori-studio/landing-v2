interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  position?: "fixed" | "relative";
  brand?: string;
  links?: FooterLink[];
  studioCreditText?: string;
  studioCreditLabel?: string;
  studioCreditHref?: string;
}

export default function Footer({
  position = "fixed",
  brand = "Ekza Space",
  links = [],
  studioCreditText,
  studioCreditLabel,
  studioCreditHref,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const hasStudioCredit =
    Boolean(studioCreditText) &&
    Boolean(studioCreditLabel) &&
    Boolean(studioCreditHref);

  return (
    <footer
      className={`relative z-10 w-full border-t border-slate-200/80 bg-white/60 pb-[max(0px,env(safe-area-inset-bottom))] text-slate-500 backdrop-blur-md dark:border-white/10 dark:bg-black/40 dark:text-zinc-400 ${
        position === "fixed" ? "fixed bottom-0" : ""
      }`}
      id="footer"
    >
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center gap-4 text-center text-sm">
          <p className="text-slate-500 dark:text-zinc-500">
            © {currentYear}{" "}
            <span className="font-medium text-slate-700 dark:text-zinc-300">{brand}</span>
          </p>

          {links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  className="link transition hover:text-wotori-accent dark:link-on-dark"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {hasStudioCredit && (
            <p className="text-slate-500 dark:text-zinc-500">
              {studioCreditText}
              <a
                className="link ml-1 font-medium dark:link-on-dark"
                href={studioCreditHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {studioCreditLabel}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
