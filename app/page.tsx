"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { PhraseTranslator } from "@/components/phrase-translator";
import { cantToEnglish, englishToCant, argotToFrench } from "@/lib/thieves-cant-data";
import { ArrowRightLeft, Search, BookOpen, MessageSquare, Type } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type TranslationDirection = "to-cant" | "from-cant";
type TranslatorMode = "word" | "phrase";

export default function TranslatorPage() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<TranslationDirection>("to-cant");
  const [mode, setMode] = useState<TranslatorMode>("word");
  const { language, t } = useI18n();

  const results = useMemo(() => {
    if (!input.trim()) return [];
    
    const searchTerm = input.toLowerCase().trim();
    
    if (language === "en") {
      if (direction === "to-cant") {
        // English to Cant
        const matches: { source: string; cant: string[] }[] = [];
        
        Object.entries(englishToCant).forEach(([english, cantTerms]) => {
          if (english.toLowerCase().includes(searchTerm)) {
            matches.push({ source: english, cant: cantTerms });
          }
        });
        
        // Also search in cantToEnglish definitions
        cantToEnglish.forEach((entry) => {
          if (entry.definition.toLowerCase().includes(searchTerm)) {
            const existing = matches.find(m => m.cant.includes(entry.term));
            if (!existing) {
              matches.push({ source: entry.definition, cant: [entry.term] });
            }
          }
        });
        
        return matches.slice(0, 15);
      } else {
        // Cant to English
        return cantToEnglish
          .filter((entry) => entry.term.toLowerCase().includes(searchTerm))
          .map((entry) => ({
            cantTerm: entry.term,
            translation: entry.definition,
            category: entry.category,
          }))
          .slice(0, 15);
      }
    } else {
      // French - Use authentic "Argot des Voleurs" (1849)
      if (direction === "to-cant") {
        // French to Argot - search in frenchToArgot dictionary
        const matches: { french: string; argot: string }[] = [];
        
        Object.entries(frenchToArgot).forEach(([french, argotTerms]) => {
          if (french.toLowerCase().includes(searchTerm)) {
            matches.push({ french, argot: argotTerms });
          }
        });
        
        // Also search in argotToFrench for reverse lookup
        argotToFrench.forEach((entry) => {
          if (entry.definition.toLowerCase().includes(searchTerm)) {
            const existing = matches.find(m => m.argot.includes(entry.term));
            if (!existing) {
              matches.push({ french: entry.definition, argot: entry.term });
            }
          }
        });
        
        return matches.slice(0, 15);
      } else {
        // Argot to French - use authentic argotToFrench dictionary
        return argotToFrench
          .filter((entry) => entry.term.toLowerCase().includes(searchTerm))
          .map((entry) => ({
            argotTerm: entry.term,
            translation: entry.definition,
            category: entry.category,
          }))
          .slice(0, 15);
      }
    }
  }, [input, language, direction]);

  const getPlaceholder = () => {
    if (language === "en") {
      return direction === "to-cant"
        ? "Enter an English word (e.g., thief, money, steal)..."
        : "Enter a Cant word (e.g., prig, blunt, nim)...";
    } else {
      return direction === "to-cant"
        ? "Entrez un mot en français (ex: voleur, argent, voler)..."
        : "Entrez un mot en Cant (ex: prig, blunt, nim)...";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-primary text-glow mb-4">
            {t("translator.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto aged-text">
            {t("translator.subtitle")}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setMode("word")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${
              mode === "word"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary/50 text-foreground"
            }`}
          >
            <Type className="h-4 w-4" />
            {language === "en" ? "Word Search" : "Recherche de Mots"}
          </button>
          <button
            onClick={() => setMode("phrase")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${
              mode === "phrase"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary/50 text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            {language === "en" ? "Phrase Translator" : "Traducteur de Phrases"}
          </button>
        </div>

        {/* Phrase Translator Mode */}
        {mode === "phrase" && (
          <div className="parchment ornate-border rounded-lg p-6 mb-8">
            <PhraseTranslator />
          </div>
        )}

        {/* Word Search Mode */}
        {mode === "word" && (
          <>
            <div className="parchment ornate-border rounded-lg p-6 mb-8">
              {/* Direction Selection */}
              <div className="flex justify-center gap-3 mb-6">
                <button
                  onClick={() => setDirection("to-cant")}
                  className={`px-4 py-2 rounded border transition-all text-sm ${
                    direction === "to-cant"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  {language === "en" ? t("translator.englishToCant") : t("translator.frenchToCant")}
                </button>
                <button
                  onClick={() => setDirection("from-cant")}
                  className={`px-4 py-2 rounded border transition-all text-sm ${
                    direction === "from-cant"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  {language === "en" ? t("translator.cantToEnglish") : t("translator.cantToFrench")}
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-lg bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </>
        )}

        {/* Results - Word Search Mode Only */}
        {mode === "word" && results.length > 0 && (
          <div className="parchment ornate-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-primary">
                {results.length} {t("translator.results")}
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* English to Cant results */}
              {language === "en" && direction === "to-cant" && (
                <>
                  {(results as { source: string; cant: string[] }[]).map((result, i) => (
                    <div key={i} className="bg-background/50 rounded p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <span className="text-muted-foreground capitalize">{result.source}</span>
                        <ArrowRightLeft className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <div className="flex flex-wrap gap-2">
                          {result.cant.map((term, j) => (
                            <span key={j} className="px-2 py-1 bg-primary/20 text-primary rounded text-sm font-medium">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Cant to English results */}
              {language === "en" && direction === "from-cant" && (
                <>
                  {(results as { cantTerm: string; translation: string; category?: string }[]).map((result, i) => (
                    <div key={i} className="bg-background/50 rounded p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <span className="text-primary font-medium">{result.cantTerm}</span>
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                        <span className="text-foreground">{result.translation}</span>
                      </div>
                      {result.category && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-accent/30 text-accent-foreground rounded">
                          {t(`category.${result.category}` as any) || result.category}
                        </span>
                      )}
                    </div>
                  ))}
                </>
              )}
              
              {/* French to Argot results */}
              {language === "fr" && direction === "to-cant" && (
                <>
                  {(results as { french: string; argot: string }[]).map((result, i) => (
                    <div key={i} className="bg-background/50 rounded p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <span className="text-muted-foreground capitalize">{result.french}</span>
                        <ArrowRightLeft className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <div className="flex flex-wrap gap-2">
                          {result.argot.split(", ").map((term, j) => (
                            <span key={j} className="px-2 py-1 bg-primary/20 text-primary rounded text-sm font-medium">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Argot to French results */}
              {language === "fr" && direction === "from-cant" && (
                <>
                  {(results as { argotTerm: string; translation: string; category?: string }[]).map((result, i) => (
                    <div key={i} className="bg-background/50 rounded p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <span className="text-primary font-medium">{result.argotTerm}</span>
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                        <span className="text-foreground">{result.translation}</span>
                      </div>
                      {result.category && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-accent/30 text-accent-foreground rounded">
                          {result.category}
                        </span>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Empty State - Word Search Mode Only */}
        {mode === "word" && input && results.length === 0 && (
          <div className="parchment ornate-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              {t("translator.noResults")}
            </p>
          </div>
        )}

        {/* Quick Reference - Word Search Mode Only */}
        {mode === "word" && !input && (
          <div className="parchment ornate-border rounded-lg p-6">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-primary text-glow mb-4">
              {t("translator.quickRef")}
            </h2>
            {language === "en" ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-background/50 rounded p-4 border border-border">
                  <h3 className="text-sm font-semibold text-primary mb-2">
                    {t("translator.commonTerms")}
                  </h3>
                  <ul className="text-sm space-y-1 text-foreground/80">
                    <li><span className="text-primary">Prig</span> - A thief</li>
                    <li><span className="text-primary">Blunt</span> - Money</li>
                    <li><span className="text-primary">Ken</span> - A house</li>
                    <li><span className="text-primary">Darkmans</span> - Night time</li>
                    <li><span className="text-primary">Bene</span> - Good</li>
                  </ul>
                </div>
                <div className="bg-background/50 rounded p-4 border border-border">
                  <h3 className="text-sm font-semibold text-primary mb-2">
                    Useful Phrases
                  </h3>
                  <ul className="text-sm space-y-1 text-foreground/80">
                    <li><span className="text-primary">Bene Darkmans</span> - Good night</li>
                    <li><span className="text-primary">Flash lingo</span> - Thieves cant</li>
                    <li><span className="text-primary">Stop hole abbey</span> - Guild hideout</li>
                    <li><span className="text-primary">Rum diver</span> - Skilled pickpocket</li>
                    <li><span className="text-primary">Upright Man</span> - Guild master</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-background/50 rounded p-4 border border-border">
                  <h3 className="text-sm font-semibold text-primary mb-2">
                    Termes Courants (Argot des Voleurs)
                  </h3>
                  <ul className="text-sm space-y-1 text-foreground/80">
                    <li><span className="text-primary">Pègre</span> - Voleur</li>
                    <li><span className="text-primary">Pognon</span> - Argent</li>
                    <li><span className="text-primary">Cambuse</span> - Maison</li>
                    <li><span className="text-primary">Sorgue</span> - Nuit</li>
                    <li><span className="text-primary">Chenu</span> - Bon, beau</li>
                  </ul>
                </div>
                <div className="bg-background/50 rounded p-4 border border-border">
                  <h3 className="text-sm font-semibold text-primary mb-2">
                    Expressions Utiles
                  </h3>
                  <ul className="text-sm space-y-1 text-foreground/80">
                    <li><span className="text-primary">Buter</span> - Tuer</li>
                    <li><span className="text-primary">Bigorne</span> - Langue de l&apos;argot</li>
                    <li><span className="text-primary">Taule</span> - Prison</li>
                    <li><span className="text-primary">Tireur</span> - Pickpocket</li>
                    <li><span className="text-primary">Coesre</span> - Roi de l&apos;argot (chef)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          {language === "en" 
            ? "Based on the \"Dictionary of the Vulgar Tongue\" (1811) by Captain Francis Grose"
            : "Basé sur \"Le nouveau dictionnaire complet du jargon de l'argot\" (1849) d'Arthur Halbert d'Angers"}
        </p>
      </main>
    </div>
  );
}
