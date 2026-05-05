import Link from "next/link";
import { BookOpen } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Features", href: "#methodology" },
    { label: "Methodology", href: "#methodology" },
  ],
  Resources: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Support", href: "/support" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <BookOpen className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-text-primary">Research Portal</p>
                <p className="text-[10px] text-text-secondary">Academic Excellence</p>
              </div>
            </Link>
            <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
              A comprehensive research management platform designed for academic researchers, providing
              advanced tools for data analysis, visualization, and collaboration.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-text-secondary text-center">
            © {new Date().getFullYear()} Research Portal. Academic Research Platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
