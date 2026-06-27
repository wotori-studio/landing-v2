import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterProps {
  position?: "fixed" | "relative";
  brand?: string;
  links?: FooterLink[];
  navLinks?: FooterLink[];
  studioCreditText?: string;
  studioCreditLabel?: string;
  studioCreditHref?: string;
}

export default function Footer({
  position = "fixed",
  brand = "Ekza Space",
  links = [],
  navLinks = [],
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
      className={`w-full border-t border-ekza-border/25 bg-ekza-muted/80 dark:border-white/10 dark:bg-[#111417]/95 ${
        position === "fixed" ? "fixed bottom-0" : ""
      }`}
      id="footer"
    >
      <div className="container mx-auto px-6 py-8 text-ekza-on-muted dark:text-white/55">
        <div className="flex flex-col items-center gap-3 text-center text-sm">
          <p className="flex items-center justify-center gap-1.5">
            <span>© {currentYear}</span>
            <span className="font-audiowide lowercase text-ekza-on dark:text-white">
              ekza
            </span>
          </p>

          {navLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    className="link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} className="link" href={link.href}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          )}

          {links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  className="link"
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
            <p>
              {studioCreditText}
              <a
                className="link ml-1"
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
