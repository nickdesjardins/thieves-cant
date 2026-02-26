"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { cantToEnglish, categories, argotToFrench, frenchCategories } from "@/lib/thieves-cant-data";
import { Search, Filter, BookMarked } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { language, t } = useI18n();

  // Use appropriate dictionary based on language
  const dictionaryData = language === "en" ? cantToEnglish : argotToFrench;
  const categoryList = language === "en" ? categories : frenchCategories;

  const filteredEntries = useMemo(() => {
    let entries = [...dictionaryData];
    
    if (search) {
      const searchLower = search.toLowerCase();
      entries = entries.filter(
        (entry) =>
          entry.term.toLowerCase().includes(searchLower) ||
          entry.definition.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedCategory) {
      entries = entries.filter((entry) => entry.category === selectedCategory);
    }
    
    // Sort alphabetically
    entries.sort((a, b) => a.term.localeCompare(b.term));
    
    return entries;
  }, [search, selectedCategory, dictionaryData]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, typeof dictionaryData> = {};
    
    filteredEntries.forEach((entry) => {
      const letter = entry.term[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(entry);
    });
    
    return groups;
  }, [filteredEntries]);

  const letters = Object.keys(groupedEntries).sort();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-primary text-glow mb-2">
            {t("dictionary.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("dictionary.subtitle")}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="parchment ornate-border rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("dictionary.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-3 rounded bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-3 rounded bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground"
              >
                <option value="">{t("dictionary.allCategories")}</option>
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 text-sm text-muted-foreground">
            {t("dictionary.showing")} {filteredEntries.length} {t("dictionary.of")} {dictionaryData.length} {t("dictionary.entries")}
          </div>
        </div>

        {/* Alphabet Navigation */}
        <div className="parchment rounded-lg p-4 mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => {
              const hasEntries = groupedEntries[letter];
              return (
                <a
                  key={letter}
                  href={hasEntries ? `#letter-${letter}` : undefined}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                    hasEntries
                      ? "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                      : "bg-secondary/30 text-muted-foreground/50 cursor-default"
                  }`}
                >
                  {letter}
                </a>
              );
            })}
          </div>
        </div>

        {/* Dictionary Entries */}
        <div className="space-y-8">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded border border-primary/50 bg-primary/10">
                  <span className="font-[family-name:var(--font-display)] text-2xl text-primary">
                    {letter}
                  </span>
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid gap-3">
                {groupedEntries[letter].map((entry, i) => (
                  <div
                    key={`${letter}-${i}`}
                    className="parchment rounded-lg p-4 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <BookMarked className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-primary font-semibold text-lg">{entry.term}</span>
                      </div>
                      <span className="text-foreground/80 flex-1 pl-6 sm:pl-0">
                        {entry.definition}
                      </span>
                    </div>
                    {entry.category && (
                      <span className="inline-block mt-2 ml-6 sm:ml-0 text-xs px-2 py-0.5 bg-accent/30 text-accent-foreground rounded">
                        {entry.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* No Results */}
        {filteredEntries.length === 0 && (
          <div className="parchment ornate-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              {t("dictionary.noResults")}
            </p>
          </div>
        )}

        {/* Back to Top */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="inline-block px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {t("dictionary.backToTop")}
          </a>
        </div>
      </main>
    </div>
  );
}
