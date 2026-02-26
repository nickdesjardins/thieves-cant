"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "en" | "fr";

// All translations for the app
const translations = {
  en: {
    // Navigation
    "nav.translator": "Translator",
    "nav.dictionary": "Dictionary",
    "nav.symbols": "Symbols",
    "nav.title": "Thieves' Cant",
    "nav.subtitle": "D&D 5e Rogue Companion",
    
    // Translator Page
    "translator.title": "Thieves' Cant Translator",
    "translator.subtitle": "Master the secret language of rogues and scoundrels",
    "translator.placeholder": "Enter words to translate...",
    "translator.englishToCant": "English to Cant",
    "translator.cantToEnglish": "Cant to English",
    "translator.frenchToCant": "Français to Cant",
    "translator.cantToFrench": "Cant to Français",
    "translator.noResults": "No matches found. Try a different word or phrase.",
    "translator.quickRef": "Quick Reference",
    "translator.commonTerms": "Common Terms",
    "translator.searchHint": "Type to search...",
    "translator.term": "Term",
    "translator.translation": "Translation",
    "translator.results": "results",
    
    // Dictionary Page
    "dictionary.title": "The Complete Dictionary",
    "dictionary.subtitle": "A comprehensive collection of Thieves' Cant terminology",
    "dictionary.searchPlaceholder": "Search terms or definitions...",
    "dictionary.allCategories": "All Categories",
    "dictionary.showing": "Showing",
    "dictionary.of": "of",
    "dictionary.entries": "entries",
    "dictionary.noResults": "No entries found matching your search criteria.",
    "dictionary.backToTop": "Back to Top",
    
    // Symbols Page
    "symbols.title": "Secret Symbols",
    "symbols.subtitle": "Hidden marks and signs used by rogues, vagabonds, and thieves' guilds to communicate in plain sight.",
    "symbols.guildMarks": "Thieves' Guild Marks",
    "symbols.hoboSigns": "Hobo Signs",
    "symbols.all": "All",
    "symbols.guildTitle": "Guild Marks",
    "symbols.guildDesc": "Thieves' guilds throughout the realms use secret symbols to mark territory, identify safe houses, warn of danger, and communicate with fellow guild members. These marks are often scratched into walls, drawn in chalk, or carved into wooden posts.",
    "symbols.guildTip": "For D&D 5e: A Rogue with proficiency in Thieves' Cant can read and leave these marks. An Intelligence (Investigation) check DC 15 may be required to find hidden marks.",
    "symbols.hoboTitle": "Hobo Signs",
    "symbols.hoboDesc": "Historical symbols used by wandering travelers and vagabonds to leave messages for others. These simple marks convey important information about food, shelter, danger, and opportunities.",
    "symbols.hoboTip": "For D&D 5e: These can represent marks left by traveling merchants, wandering folk, or urban poor. Perfect for adding world detail to your campaign.",
    "symbols.categoryLegend": "Category Legend",
    "symbols.dmTips": "DM Tips",
    "symbols.dmTip1": "Place guild marks near the entrances of taverns, alleyways, or under bridges",
    "symbols.dmTip2": "Have NPCs reference \"the marks\" when giving directions to rogues",
    "symbols.dmTip3": "Create plot hooks by having players discover contradictory or unusual marks",
    "symbols.dmTip4": "Allow Rogues to leave their own marks to aid the party later",
    "symbols.dmTip5": "Use these symbols as puzzle elements in heist or urban adventures",
    
    // Categories
    "category.Warning": "Warning",
    "category.Resource": "Resource",
    "category.Direction": "Direction",
    "category.Info": "Info",
    "category.Safe": "Safe",
    "category.Identity": "Identity",
    "category.Commerce": "Commerce",
    "category.Contact": "Contact",
    "category.Territory": "Territory",
    "category.Target": "Target",
    "category.Route": "Route",
    "category.Escape": "Escape",
    "category.People": "People",
    "category.Actions": "Actions",
    "category.Places": "Places",
    "category.Objects": "Objects",
    "category.Money": "Money",
    "category.Law": "Law",
    "category.Body": "Body",
    "category.Food & Drink": "Food & Drink",
    "category.Clothing": "Clothing",
    "category.Animals": "Animals",
    "category.Descriptive": "Descriptive",
    "category.General": "General",
    
    // Category descriptions
    "categoryDesc.Warning": "Danger ahead",
    "categoryDesc.Resource": "Helpful locations",
    "categoryDesc.Direction": "Travel guidance",
    "categoryDesc.Info": "General information",
    "categoryDesc.Safe": "Safe locations",
    "categoryDesc.Identity": "Guild membership",
    "categoryDesc.Commerce": "Trade opportunities",
    "categoryDesc.Contact": "People to meet",
    "categoryDesc.Territory": "Guild boundaries",
    "categoryDesc.Target": "Valuable marks",
    "categoryDesc.Route": "Travel paths",
    "categoryDesc.Escape": "Quick exits",
  },
  fr: {
    // Navigation
    "nav.translator": "Traducteur",
    "nav.dictionary": "Dictionnaire",
    "nav.symbols": "Symboles",
    "nav.title": "Jargon des Voleurs",
    "nav.subtitle": "Compagnon du Roublard D&D 5e",
    
    // Translator Page
    "translator.title": "Traducteur du Jargon des Voleurs",
    "translator.subtitle": "Maîtrisez le langage secret des roublards et des scélérats",
    "translator.placeholder": "Entrez les mots à traduire...",
    "translator.englishToCant": "Anglais vers Jargon",
    "translator.cantToEnglish": "Jargon vers Anglais",
    "translator.frenchToCant": "Français vers Jargon",
    "translator.cantToFrench": "Jargon vers Français",
    "translator.noResults": "Aucun résultat trouvé. Essayez un autre mot ou une autre phrase.",
    "translator.quickRef": "Référence Rapide",
    "translator.commonTerms": "Termes Courants",
    "translator.searchHint": "Tapez pour rechercher...",
    "translator.term": "Terme",
    "translator.translation": "Traduction",
    "translator.results": "résultats",
    
    // Dictionary Page
    "dictionary.title": "Le Dictionnaire Complet",
    "dictionary.subtitle": "Une collection complète de la terminologie du Jargon des Voleurs",
    "dictionary.searchPlaceholder": "Rechercher des termes ou des définitions...",
    "dictionary.allCategories": "Toutes les Catégories",
    "dictionary.showing": "Affichage de",
    "dictionary.of": "sur",
    "dictionary.entries": "entrées",
    "dictionary.noResults": "Aucune entrée trouvée correspondant à vos critères de recherche.",
    "dictionary.backToTop": "Retour en Haut",
    
    // Symbols Page
    "symbols.title": "Symboles Secrets",
    "symbols.subtitle": "Marques et signes cachés utilisés par les roublards, vagabonds et guildes de voleurs pour communiquer en toute discrétion.",
    "symbols.guildMarks": "Marques de Guilde des Voleurs",
    "symbols.hoboSigns": "Signes des Vagabonds",
    "symbols.all": "Tous",
    "symbols.guildTitle": "Marques de Guilde",
    "symbols.guildDesc": "Les guildes de voleurs à travers les royaumes utilisent des symboles secrets pour marquer leur territoire, identifier les refuges sûrs, avertir du danger et communiquer avec leurs confrères. Ces marques sont souvent gravées dans les murs, dessinées à la craie ou sculptées dans des poteaux en bois.",
    "symbols.guildTip": "Pour D&D 5e: Un Roublard maîtrisant le Jargon des Voleurs peut lire et laisser ces marques. Un test d'Intelligence (Investigation) DD 15 peut être nécessaire pour trouver les marques cachées.",
    "symbols.hoboTitle": "Signes des Vagabonds",
    "symbols.hoboDesc": "Symboles historiques utilisés par les voyageurs errants et les vagabonds pour laisser des messages aux autres. Ces marques simples transmettent des informations importantes sur la nourriture, le refuge, le danger et les opportunités.",
    "symbols.hoboTip": "Pour D&D 5e: Ces marques peuvent représenter les signes laissés par les marchands itinérants, les gens du voyage ou les pauvres des villes. Parfait pour ajouter du détail au monde de votre campagne.",
    "symbols.categoryLegend": "Légende des Catégories",
    "symbols.dmTips": "Conseils pour le MJ",
    "symbols.dmTip1": "Placez les marques de guilde près des entrées de tavernes, dans les ruelles ou sous les ponts",
    "symbols.dmTip2": "Faites référencer \"les marques\" par les PNJ lorsqu'ils donnent des directions aux roublards",
    "symbols.dmTip3": "Créez des accroches scénaristiques en faisant découvrir aux joueurs des marques contradictoires ou inhabituelles",
    "symbols.dmTip4": "Permettez aux Roublards de laisser leurs propres marques pour aider le groupe plus tard",
    "symbols.dmTip5": "Utilisez ces symboles comme éléments de puzzle dans des aventures de cambriolage ou urbaines",
    
    // Categories
    "category.Warning": "Avertissement",
    "category.Resource": "Ressource",
    "category.Direction": "Direction",
    "category.Info": "Info",
    "category.Safe": "Sûr",
    "category.Identity": "Identité",
    "category.Commerce": "Commerce",
    "category.Contact": "Contact",
    "category.Territory": "Territoire",
    "category.Target": "Cible",
    "category.Route": "Route",
    "category.Escape": "Évasion",
    "category.People": "Personnes",
    "category.Actions": "Actions",
    "category.Places": "Lieux",
    "category.Objects": "Objets",
    "category.Money": "Argent",
    "category.Law": "Loi",
    "category.Body": "Corps",
    "category.Food & Drink": "Nourriture et Boisson",
    "category.Clothing": "Vêtements",
    "category.Animals": "Animaux",
    "category.Descriptive": "Descriptif",
    "category.General": "Général",
    
    // Category descriptions
    "categoryDesc.Warning": "Danger devant",
    "categoryDesc.Resource": "Lieux utiles",
    "categoryDesc.Direction": "Guide de voyage",
    "categoryDesc.Info": "Informations générales",
    "categoryDesc.Safe": "Lieux sûrs",
    "categoryDesc.Identity": "Appartenance à la guilde",
    "categoryDesc.Commerce": "Opportunités commerciales",
    "categoryDesc.Contact": "Personnes à rencontrer",
    "categoryDesc.Territory": "Limites de la guilde",
    "categoryDesc.Target": "Cibles de valeur",
    "categoryDesc.Route": "Chemins de voyage",
    "categoryDesc.Escape": "Sorties rapides",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || translations.en[key] || key;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  return useI18n();
}
