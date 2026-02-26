"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { language } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            {language === "en" 
              ? `© ${currentYear} PcSquad. All rights reserved.`
              : `© ${currentYear} PcSquad. Tous droits réservés.`}
          </p>
          <a 
            href="https://webman.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {language === "en" ? "Created by Webman" : "Créé par Webman"}
          </a>
        </div>
      </div>
    </footer>
  );
}
