"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { hoboSymbols, thievesGuildSymbols } from "@/lib/thieves-cant-data";
import { Shield, Compass, AlertTriangle, CircleDot, Map, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type SymbolTab = "hobo" | "guild";

const categoryIcons: Record<string, React.ReactNode> = {
  Warning: <AlertTriangle className="h-4 w-4" />,
  Resource: <CircleDot className="h-4 w-4" />,
  Direction: <Compass className="h-4 w-4" />,
  Info: <Map className="h-4 w-4" />,
  Safe: <Shield className="h-4 w-4" />,
  Identity: <Users className="h-4 w-4" />,
  Commerce: <CircleDot className="h-4 w-4" />,
  Contact: <Users className="h-4 w-4" />,
  Territory: <Map className="h-4 w-4" />,
  Target: <AlertTriangle className="h-4 w-4" />,
  Route: <Compass className="h-4 w-4" />,
  Escape: <Compass className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  Warning: "bg-destructive/20 text-destructive border-destructive/30",
  Resource: "bg-green-900/30 text-green-400 border-green-700/30",
  Direction: "bg-blue-900/30 text-blue-400 border-blue-700/30",
  Info: "bg-secondary text-foreground border-border",
  Safe: "bg-green-900/30 text-green-400 border-green-700/30",
  Identity: "bg-primary/20 text-primary border-primary/30",
  Commerce: "bg-primary/20 text-primary border-primary/30",
  Contact: "bg-accent/30 text-accent-foreground border-accent/50",
  Territory: "bg-accent/30 text-accent-foreground border-accent/50",
  Target: "bg-destructive/20 text-destructive border-destructive/30",
  Route: "bg-blue-900/30 text-blue-400 border-blue-700/30",
  Escape: "bg-blue-900/30 text-blue-400 border-blue-700/30",
};

// French translations for symbol meanings
const symbolTranslations: Record<string, { name: string; meaning: string }> = {
  // Guild Marks
  "Guild Territory": { name: "Territoire de Guilde", meaning: "Zone sous contrôle de la guilde" },
  "Safe House": { name: "Maison Sûre", meaning: "Refuge sécurisé disponible ici" },
  "Fence Contact": { name: "Contact Receleur", meaning: "Receleur fiable dans les environs" },
  "Guard Patrol": { name: "Patrouille de Gardes", meaning: "Attention - gardes actifs dans cette zone" },
  "Easy Mark": { name: "Cible Facile", meaning: "Cible riche et imprudente à proximité" },
  "Thieves Highway": { name: "Voie des Voleurs", meaning: "Route sûre par les toits" },
  "Guild Meeting": { name: "Réunion de Guilde", meaning: "Rassemblement de la guilde ici" },
  "Trap Warning": { name: "Attention Piège", meaning: "Piège ou alarme détecté" },
  "Lockbox Location": { name: "Emplacement de Coffre", meaning: "Coffre-fort ou cachette à butin à proximité" },
  "Escape Route": { name: "Voie d'Évasion", meaning: "Sortie d'urgence ou évasion rapide" },
  "Corrupt Official": { name: "Officiel Corrompu", meaning: "Garde ou officiel acceptant les pots-de-vin" },
  "Master Thief": { name: "Maître Voleur", meaning: "Voleur de haut rang de la guilde dans les environs" },
  // Hobo Signs
  "Danger": { name: "Danger", meaning: "Endroit dangereux, évitez" },
  "Kind Woman": { name: "Femme Bienveillante", meaning: "Femme gentille vit ici" },
  "Food Available": { name: "Nourriture Disponible", meaning: "Nourriture pour le travail" },
  "Safe Camp": { name: "Campement Sûr", meaning: "Endroit sûr pour dormir" },
  "Vicious Dog": { name: "Chien Méchant", meaning: "Chien dangereux dans les environs" },
  "Go This Way": { name: "Allez Par Là", meaning: "Route sûre dans cette direction" },
  "Doctor Here": { name: "Médecin Ici", meaning: "Soins médicaux disponibles" },
  "Religious Talk": { name: "Discours Religieux", meaning: "Préparez-vous à un sermon pour de l'aide" },
  "Courthouse": { name: "Tribunal", meaning: "Tribunal à proximité - soyez prudent" },
  "Unsafe Place": { name: "Lieu Dangereux", meaning: "Évitez cet endroit" },
  "Fresh Water": { name: "Eau Fraîche", meaning: "Eau potable disponible" },
  "Wealthy Person": { name: "Personne Riche", meaning: "Personne riche vit ici" },
};

export default function SymbolsPage() {
  const [activeTab, setActiveTab] = useState<SymbolTab>("guild");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { language, t } = useI18n();

  const currentSymbols = activeTab === "hobo" ? hoboSymbols : thievesGuildSymbols;
  
  const filteredSymbols = selectedCategory
    ? currentSymbols.filter((s) => s.category === selectedCategory)
    : currentSymbols;

  const currentCategories = [...new Set(currentSymbols.map((s) => s.category))];

  const getSymbolText = (symbol: { name: string; meaning: string }) => {
    if (language === "fr" && symbolTranslations[symbol.name]) {
      return symbolTranslations[symbol.name];
    }
    return symbol;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-primary text-glow mb-2">
            {t("symbols.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("symbols.subtitle")}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab("guild");
              setSelectedCategory(null);
            }}
            className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
              activeTab === "guild"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/50 border-border hover:border-primary/50 text-foreground"
            }`}
          >
            {t("symbols.guildMarks")}
          </button>
          <button
            onClick={() => {
              setActiveTab("hobo");
              setSelectedCategory(null);
            }}
            className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
              activeTab === "hobo"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/50 border-border hover:border-primary/50 text-foreground"
            }`}
          >
            {t("symbols.hoboSigns")}
          </button>
        </div>

        {/* Description */}
        <div className="parchment ornate-border rounded-lg p-6 mb-8">
          {activeTab === "guild" ? (
            <div className="space-y-3 text-foreground/80">
              <h2 className="text-lg font-semibold text-primary">{t("symbols.guildTitle")}</h2>
              <p>{t("symbols.guildDesc")}</p>
              <p className="text-sm text-muted-foreground">{t("symbols.guildTip")}</p>
            </div>
          ) : (
            <div className="space-y-3 text-foreground/80">
              <h2 className="text-lg font-semibold text-primary">{t("symbols.hoboTitle")}</h2>
              <p>{t("symbols.hoboDesc")}</p>
              <p className="text-sm text-muted-foreground">{t("symbols.hoboTip")}</p>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-foreground hover:bg-secondary"
            }`}
          >
            {t("symbols.all")}
          </button>
          {currentCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-foreground hover:bg-secondary"
              }`}
            >
              {categoryIcons[cat]}
              {t(`category.${cat}` as any) || cat}
            </button>
          ))}
        </div>

        {/* Symbols Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSymbols.map((symbol, i) => {
            const displayText = getSymbolText(symbol);
            return (
              <div
                key={i}
                className="parchment rounded-lg p-5 border border-border hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-background border border-border text-3xl group-hover:border-primary/50 transition-colors shrink-0">
                    {symbol.symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-primary font-semibold mb-1 truncate">
                      {displayText.name}
                    </h3>
                    <p className="text-sm text-foreground/80 mb-2">
                      {displayText.meaning}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${
                        categoryColors[symbol.category] || "bg-secondary text-foreground border-border"
                      }`}
                    >
                      {categoryIcons[symbol.category]}
                      {t(`category.${symbol.category}` as any) || symbol.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-12 parchment ornate-border rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-primary text-glow mb-4">
            {t("symbols.categoryLegend")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentCategories.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-sm border ${
                    categoryColors[cat] || "bg-secondary text-foreground border-border"
                  }`}
                >
                  {categoryIcons[cat]}
                  {t(`category.${cat}` as any) || cat}
                </span>
                <span className="text-sm text-muted-foreground">
                  - {t(`categoryDesc.${cat}` as any)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DM Tips */}
        <div className="mt-8 parchment rounded-lg p-6 border border-primary/20">
          <h2 className="text-lg font-semibold text-primary mb-3">{t("symbols.dmTips")}</h2>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>{"•"} {t("symbols.dmTip1")}</li>
            <li>{"•"} {t("symbols.dmTip2")}</li>
            <li>{"•"} {t("symbols.dmTip3")}</li>
            <li>{"•"} {t("symbols.dmTip4")}</li>
            <li>{"•"} {t("symbols.dmTip5")}</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
