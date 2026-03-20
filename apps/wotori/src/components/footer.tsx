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
      className={`bg-gray-100 shadow-sm w-full ${
        position === "fixed" ? "fixed bottom-0" : ""
      }`}
      id="footer"
    >
      <div className="container mx-auto px-6 py-6 text-gray-600">
        <div className="flex flex-col items-center gap-3 text-center">
          <p>© {currentYear} {brand}</p>

          {links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm">
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
            <p className="text-sm">
              {studioCreditText}
              <a
                className="ml-1 link"
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
