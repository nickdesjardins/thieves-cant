"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useI18n, Language } from "@/lib/i18n";

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();

  const navItems = [
    { href: "/", label: t("nav.translator") },
    { href: "/dictionary", label: t("nav.dictionary") },
    { href: "/symbols", label: t("nav.symbols") },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <nav className="parchment border-b border-border">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-primary/50 bg-background/50">
              <span className="text-xl text-primary">&#9876;</span>
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-xl text-primary text-glow">
                {t("nav.title")}
              </h1>
              <p className="text-xs text-muted-foreground">{t("nav.subtitle")}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded",
                  "hover:bg-primary/10 hover:text-primary",
                  pathname === item.href
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-foreground/80"
                )}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="ml-4 flex items-center gap-2 px-3 py-2 rounded border border-border hover:border-primary/50 hover:bg-primary/10 transition-colors"
              aria-label="Switch language"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {language === "en" ? "FR" : "EN"}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-border hover:border-primary/50 transition-colors"
              aria-label="Switch language"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                {language === "en" ? "FR" : "EN"}
              </span>
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-colors rounded",
                    "hover:bg-primary/10 hover:text-primary",
                    pathname === item.href
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-foreground/80"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
